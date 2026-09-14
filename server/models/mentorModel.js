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
      default: "",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", ""],
      default: "",
    },
    age: {
      type: Number,
      default: null,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Senior Engineer",
    },
    company: {
      type: String,
      trim: true,
      default: "Tech Company",
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: ["React", "Node.js", "System Design"],
    },
    experience: {
      type: String,
      default: "5+ years",
    },
    bio: {
      type: String,
      default: "Experienced mentor guiding students in software engineering and career growth.",
    },
    price: {
      type: Number,
      default: 1499,
    },
    languages: {
      type: mongoose.Schema.Types.Mixed,
      default: ["English"],
    },
    availability: {
      type: String,
      default: "Flexible Hours",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
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
