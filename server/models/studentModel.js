import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentID: {
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
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    phone: {
      type: String,
      required: true,
      match: /^\d+$/,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.post("save", async (stu, next) => {
  try {
    await mongoose.model("users").findByIdAndUpdate(stu.studentID, {
      $set: { role: "student" },
    });
    next();
  } catch (err) {
    next(err);
  }
});


const studentModel = mongoose.model("students", studentSchema);

export default studentModel;
