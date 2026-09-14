import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    mentorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mentors",
      required: true,
      index: true,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    appointmentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointments",
      required: true,
      unique: true, // One rating per completed session
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast mentor aggregate queries
ratingSchema.index({ mentorID: 1, createdAt: -1 });

const ratingModel = mongoose.model("ratings", ratingSchema);

export default ratingModel;
