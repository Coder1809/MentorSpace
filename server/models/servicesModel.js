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
    duration: {
      type: String,
      default: "45 minutes",
    },
  },
  { timestamps: true }
);

const servicesModel = mongoose.model("services", servicesSchema);

export default servicesModel;
