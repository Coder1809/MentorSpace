import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    mentorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mentors",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Rejected", "Cancelled"],
      default: "Pending",
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index(
  { mentorID: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

const appointmentModel = mongoose.model("appointments", appointmentSchema);

export default appointmentModel;
