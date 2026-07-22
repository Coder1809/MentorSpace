import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    mentorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "9999999999",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
    age: {
      type: Number,
      default: 30,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      default: "5+ years",
    },
    bio: {
      type: String,
      default: "Experienced mentor guiding students in software engineering and career growth.",
    },
    status: {
      type: String,
      enum: ["Active", "Away"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

mentorSchema.post("save", async (men, next) => {
  try {
    await mongoose.model("users").findByIdAndUpdate(men.mentorID, {
      $set: { role: "mentor" },
    });
    next();
  } catch (err) {
    next(err);
  }
});


const mentorModel = mongoose.model("mentors", mentorSchema);

export default mentorModel;
