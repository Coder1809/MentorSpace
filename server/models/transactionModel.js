import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mentors",
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointments",
    },
    orderID: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
    paymentID: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    receipt: {
      type: String,
    },
    items: [
      {
        _id: false,
        name: String,
        price: Number,
        duration: String,
      },
    ],
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transactions", transactionSchema);

export default transactionModel;
