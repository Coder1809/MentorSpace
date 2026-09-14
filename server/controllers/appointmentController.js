import appointmentModel from "../models/appointmentModel.js";
import { validationResult } from "express-validator";
import studentModel from "../models/studentModel.js";
import mentorModel from "../models/mentorModel.js";
import authModel from "../models/authModel.js";
import transactionModel from "../models/transactionModel.js";
import notificationModel from "../models/notificationModel.js";
import mongoose from "mongoose";

const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const requesterUserId = req.user.id;
  const {
    mentorID: mentorDocId,
    studentID: studentUserIdFromBody,
    date,
    timeSlot,
  } = req.body;

  const effectiveStudentUserId = requesterUserId;

  // Helper logic to execute booking
  const executeBooking = async (sessionOption = {}) => {
    const stu = await studentModel.findOne({ studentID: effectiveStudentUserId }, null, sessionOption);
    if (!stu) {
      throw new Error("Student profile not found. Please complete your profile first.");
    }
    const studentID = stu._id;

    if (!mentorDocId) {
      const err = new Error("Mentor ID is required");
      err.statusCode = 400;
      throw err;
    }

    const mentor = await mentorModel.findById(mentorDocId, null, sessionOption);
    if (!mentor) {
      throw new Error(`Mentor profile not found for ID ${mentorDocId}.`);
    }

    if (mentor.status === "Away") {
      const err = new Error("Mentor is currently unavailable (Status: Away)");
      err.statusCode = 400;
      throw err;
    }

    const slotConflict = await appointmentModel.findOne(
      { mentorID: mentor._id, date, timeSlot },
      null,
      sessionOption
    );
    if (slotConflict) {
      const err = new Error("This time slot is already booked for the mentor.");
      err.statusCode = 409;
      throw err;
    }

    const existingStudentBooking = await appointmentModel.findOne(
      { studentID, mentorID: mentor._id, date },
      null,
      sessionOption
    );

    if (existingStudentBooking) {
      const err = new Error("You already have a mentorship session with this mentor on this date.");
      err.statusCode = 409;
      throw err;
    }

    const appointment = new appointmentModel({
      studentID,
      mentorID: mentor._id,
      date,
      timeSlot,
      status: "Pending",
      reason: req.body.reason,
    });

    await appointment.save(sessionOption);
    return appointment;
  };

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    const appointment = await executeBooking({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Mentorship session successfully booked",
      data: appointment,
    });
  } catch (err) {
    if (session) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
    }

    // Fallback for standalone MongoDB instance (where transactions are not supported)
    if (err.message && err.message.includes("Transaction numbers are only allowed")) {
      try {
        const appointment = await executeBooking();
        return res.status(201).json({
          success: true,
          message: "Mentorship session successfully booked",
          data: appointment,
        });
      } catch (fallbackErr) {
        if (fallbackErr.code === 11000) {
          return res.status(409).json({
            success: false,
            message: "Slot was just booked by another user. Please try again.",
          });
        }
        return res.status(fallbackErr.statusCode || 500).json({
          success: false,
          message: fallbackErr.message || "Appointment booking failed",
        });
      }
    }

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Slot was just booked by another user. Please try again.",
      });
    }

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Appointment could not be created due to a server error",
    });
  }
};

const updateAppointment = async (req, res) => {
  const { id: userId } = req.user;
  const { id: appointmentId } = req.params;

  const user = await authModel.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const role = user.role;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID",
    });
  }

  try {
    const newStatus = req.body.status;

    // Validate the requested status is a valid enum value
    const validStatuses = ["Pending", "Accepted", "Completed", "Rejected", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const filter = { _id: appointmentId };

    if (role === "mentor") {
      const mentor = await mentorModel.findOne({ mentorID: userId });
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: "Mentor profile not found",
        });
      }
      filter.mentorID = mentor._id;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch current appointment to validate status transition
    const currentAppointment = await appointmentModel.findOne(filter);
    if (!currentAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Define valid status transitions
    const validTransitions = {
      Pending: ["Accepted", "Rejected"],
      Accepted: ["Completed", "Cancelled"],
      Completed: [], // Terminal state — no further changes
      Rejected: [],  // Terminal state — no further changes
      Cancelled: [], // Terminal state — no further changes
    };

    const allowed = validTransitions[currentAppointment.status] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from "${currentAppointment.status}" to "${newStatus}". Allowed transitions: ${allowed.length > 0 ? allowed.join(", ") : "none (terminal state)"}`,
      });
    }

    let updateFields = { status: newStatus };

    if (newStatus === "Rejected" || newStatus === "Cancelled") {
      // 1. Locate student user ID (auth user ID) for notifications
      const studentDoc = await studentModel.findById(currentAppointment.studentID);
      const studentUserId = studentDoc ? studentDoc.studentID : null;

      // 2. Locate mentor info for clear message
      const mentorDoc = await mentorModel.findById(currentAppointment.mentorID);
      const mentorName = mentorDoc?.name || "your mentor";

      // 3. Look up associated transaction to get refund amount
      let refundAmount = 1499; // Standard default session amount in INR
      const txn = await transactionModel
        .findOne({
          $or: [
            { appointment: currentAppointment._id },
            { student: currentAppointment.studentID, mentor: currentAppointment.mentorID },
          ],
        })
        .sort({ createdAt: -1 });

      if (txn && txn.amount) {
        // Razorpay amounts are stored in paise (e.g. 149900 = 1499 INR)
        refundAmount = txn.amount > 10000 ? Math.round(txn.amount / 100) : txn.amount;
        txn.refundStatus = "refund_initiated";
        txn.refundAmount = refundAmount;
        await txn.save();
      }

      const actionWord = newStatus === "Rejected" ? "declined" : "cancelled";
      const refundMessage = `Your mentorship session with ${mentorName} was ${actionWord} by the mentor. A 100% refund of ₹${refundAmount.toLocaleString("en-IN")} has been initiated and will be credited back to your original payment method within 5-7 business days.`;

      updateFields.refundStatus = "Refund Initiated";
      updateFields.refundAmount = refundAmount;
      updateFields.refundMessage = refundMessage;

      // 4. Create notification record for the student
      if (studentUserId) {
        await notificationModel.create({
          recipientID: studentUserId,
          senderID: userId,
          appointmentID: currentAppointment._id,
          type: newStatus === "Rejected" ? "appointment_rejected" : "appointment_cancelled",
          title: `Booking Request ${newStatus === "Rejected" ? "Declined" : "Cancelled"} — Refund Initiated`,
          message: refundMessage,
          refundAmount: refundAmount,
          read: false,
        });
      }
    }

    const appointment = await appointmentModel.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message:
        newStatus === "Rejected" || newStatus === "Cancelled"
          ? "Mentorship session request declined and student refund initiated"
          : "Mentorship session status updated",
      data: appointment,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error updating appointment",
      error: err.message,
    });
  }
};

const getAppointment = async (req, res) => {
  const { id: userID } = req.user;
  const { id: appointmentId } = req.params;

  try {
    let role = req.user.role;
    if (role === "user") {
      const user = await authModel.findById(userID);
      if (user) role = user.role;
    }

    let filter = {};

    if (role === "mentor") {
      const mentor = await mentorModel
        .findOne({ mentorID: userID })
        .select("_id")
        .lean();
      if (!mentor)
        return res.status(404).json({
          success: false,
          message: "Mentor profile not found",
        });
      filter.mentorID = mentor._id;
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    } else {
      const student = await studentModel
        .findOne({ studentID: userID })
        .select("_id")
        .lean();
      if (!student)
        return res.status(404).json({
          success: false,
          message: "Student profile not found",
        });
      filter.studentID = student._id;
      if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
        filter._id = appointmentId;
      }
    }

    const appointments = await appointmentModel
      .find(filter)
      .populate("mentorID")
      .populate("studentID");

    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("studentID")
      .populate("mentorID");

    return res.status(200).json({
      success: true,
      message: "All appointments retrieved",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err.message,
    });
  }
};

export {
  createAppointment,
  updateAppointment,
  getAppointment,
  getAllAppointments,
};
