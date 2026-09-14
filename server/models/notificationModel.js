import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    appointmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointments",
    },
    type: {
      type: String,
      enum: [
        "appointment_rejected",
        "appointment_cancelled",
        "appointment_accepted",
        "refund_initiated",
        "general",
      ],
      default: "general",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("notifications", notificationSchema);

export default notificationModel;
