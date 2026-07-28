import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Web Development",
        "Competitive Programming",
        "Machine Learning",
        "System Design",
        "DSA",
        "DevOps",
        "UI/UX",
        "Cloud",
        "Resume Review",
        "Career Guidance",
        "Mock Interview",
        "Other",
      ],
      default: "Other",
    },
    price: {
      type: Number,
      required: true,
    },
    durationWeeks: {
      type: Number,
      default: 6,
    },
    totalSessions: {
      type: Number,
      default: 12,
    },
    skillsCovered: [
      {
        type: String,
      },
    ],
    milestones: [
      {
        type: String,
      },
    ],
    mentorDetails: {
      type: String,
      default: "Assigned Senior Mentor & Lead Engineer",
    },
    trackType: {
      type: String,
      default: "Mentorship Track",
    },
    duration: {
      type: String,
      default: "6 Weeks",
    },
  },
  { timestamps: true }
);

const servicesModel = mongoose.model("services", servicesSchema);

export default servicesModel;
