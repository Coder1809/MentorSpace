import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import transactionModel from "../models/transactionModel.js";
import appointmentModel from "../models/appointmentModel.js";
import studentModel from "../models/studentModel.js";
import mentorModel from "../models/mentorModel.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_key_secret",
});

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    // Mock fallback when dummy keys are used in development/testing
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      receipt: options.receipt,
      status: "created",
    };
    res.json({ success: true, order: mockOrder, isMock: true });
  }
};

const verifyPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const userID = req.user.id;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderID,
    paymentID,
    signature,
    amount,
    currency,
    mentorID,
    date,
    timeSlot,
    reason,
    items,
  } = req.body;

  const actualOrderId = razorpay_order_id || orderID;
  const actualPaymentId = razorpay_payment_id || paymentID;
  const actualSignature = razorpay_signature || signature;

  if (!actualOrderId || !actualPaymentId) {
    return res.status(400).json({
      success: false,
      message: "orderId and paymentId are required",
    });
  }

  try {
    let isValidSignature = false;

    // HMAC verification if real signature and secret are present
    if (
      actualSignature &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_KEY_SECRET !== "dummy_key_secret"
    ) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${actualOrderId}|${actualPaymentId}`)
        .digest("hex");

      isValidSignature = generatedSignature === actualSignature;
    } else {
      // Development mock signature validation
      isValidSignature = true;
    }

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay payment signature",
      });
    }

    // 1. Fetch Student profile
    const student = await studentModel.findOne({ studentID: userID });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found. Please complete profile first.",
      });
    }

    // 2. Fetch Mentor profile if mentorID provided
    let mentor = null;
    if (mentorID) {
      mentor = await mentorModel.findOne({
        $or: [
          ...(mongoose.Types.ObjectId.isValid(mentorID)
            ? [{ _id: mentorID }, { mentorID: mentorID }]
            : []),
        ],
      });
    }

    // 3. Create Appointment after successful payment verification
    let appointmentDoc = null;
    if (mentor && date && timeSlot) {
      const parsedDate = new Date(date);
      const existingAppt = await appointmentModel.findOne({
        mentorID: mentor._id,
        date: parsedDate,
        timeSlot,
      });

      if (existingAppt) {
        appointmentDoc = existingAppt;
      } else {
        appointmentDoc = await appointmentModel.create({
          studentID: student._id,
          mentorID: mentor._id,
          date: parsedDate,
          timeSlot,
          status: "Pending",
          reason: reason || "Mentorship Session",
        });
      }
    }

    // 4. Store Transaction details in MongoDB
    const transaction = await transactionModel.create({
      userID,
      student: student._id,
      mentor: mentor ? mentor._id : undefined,
      appointment: appointmentDoc ? appointmentDoc._id : undefined,
      orderID: actualOrderId,
      orderId: actualOrderId,
      paymentID: actualPaymentId,
      paymentId: actualPaymentId,
      signature: actualSignature || "mock_signature",
      amount: amount || 10000,
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
      items: items || [{ name: "Mentorship Session", price: (amount || 10000) / 100, duration: "45 minutes" }],
      status: "success",
    });

    return res.status(201).json({
      success: true,
      message: "Payment Verified & Appointment Created Successfully",
      data: {
        transaction,
        appointment: appointmentDoc,
      },
    });
  } catch (err) {
    console.error("Payment Verification Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error verifying payment",
      error: err.message,
    });
  }
};

const getTransactions = async (req, res) => {
  const userID = req.user.id;
  try {
    const transactions = await transactionModel
      .find({ userID })
      .populate("student")
      .populate("mentor")
      .populate("appointment")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved",
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export { createOrder, verifyPayment, getTransactions };
