import ratingModel from "../models/ratingModel.js";
import appointmentModel from "../models/appointmentModel.js";
import studentModel from "../models/studentModel.js";
import mentorModel from "../models/mentorModel.js";
import mongoose from "mongoose";

/**
 * POST /api/rating
 * Submit a 1-5 star rating for a Completed appointment.
 * Only the student who booked the session can rate it, and only once.
 */
const submitRating = async (req, res) => {
  const userID = req.user.id;
  const { appointmentID, rating, review } = req.body;

  // Validate inputs
  if (!appointmentID || !mongoose.Types.ObjectId.isValid(appointmentID)) {
    return res.status(400).json({
      success: false,
      message: "Valid appointmentID is required",
    });
  }

  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }

  try {
    // 1. Get student profile for this user
    const student = await studentModel.findOne({ studentID: userID });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // 2. Verify the appointment exists, is Completed, and belongs to this student
    const appointment = await appointmentModel.findById(appointmentID);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "You can only rate a completed mentorship session",
      });
    }

    if (appointment.studentID.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only rate your own mentorship sessions",
      });
    }

    // 3. Check if already rated (enforced by unique index too, but give a better error message)
    const existingRating = await ratingModel.findOne({ appointmentID });
    if (existingRating) {
      return res.status(409).json({
        success: false,
        message: "You have already rated this session",
      });
    }

    // 4. Create the rating
    const newRating = await ratingModel.create({
      mentorID: appointment.mentorID,
      studentID: student._id,
      appointmentID,
      rating: numRating,
      review: review || "",
    });

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      data: newRating,
    });
  } catch (err) {
    // Handle duplicate key error from the unique index
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already rated this session",
      });
    }
    console.error("Rating submission error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error submitting rating",
      error: err.message,
    });
  }
};

/**
 * GET /api/rating/mentor/:mentorId
 * Get aggregate rating for a specific mentor.
 * Public endpoint — used by mentor directory cards.
 */
const getMentorRatings = async (req, res) => {
  const { mentorId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(mentorId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid mentor ID",
    });
  }

  try {
    // Find mentor by either _id or mentorID (user _id)
    const mentor = await mentorModel.findOne({
      $or: [{ _id: mentorId }, { mentorID: mentorId }],
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const aggregate = await ratingModel.aggregate([
      { $match: { mentorID: mentor._id } },
      {
        $group: {
          _id: "$mentorID",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const result = aggregate[0] || { averageRating: 0, totalRatings: 0 };

    return res.status(200).json({
      success: true,
      data: {
        mentorID: mentor._id,
        averageRating: Math.round(result.averageRating * 10) / 10,
        totalRatings: result.totalRatings,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching ratings",
      error: err.message,
    });
  }
};

/**
 * GET /api/rating/appointment/:appointmentId
 * Check if a specific appointment has been rated.
 */
const getAppointmentRating = async (req, res) => {
  const { appointmentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID",
    });
  }

  try {
    const rating = await ratingModel.findOne({ appointmentID: appointmentId });
    return res.status(200).json({
      success: true,
      data: rating || null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching rating",
      error: err.message,
    });
  }
};

export { submitRating, getMentorRatings, getAppointmentRating };
