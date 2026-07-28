import mongoose from "mongoose";
import studentModel from "../models/studentModel.js";
import appointmentModel from "../models/appointmentModel.js";
import authModel from "../models/authModel.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// Student Routes
const upsertSelfStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: errors.array().map((e) => e.msg) });
  }

  const studentID = req.user.id;

  try {
    let student = await studentModel.findOneAndUpdate({ studentID }, req.body, {
      new: true,
    });
    let isNewStudent = false;

    if (!student) {
      const newStudent = new studentModel({ ...req.body, studentID });
      student = await newStudent.save();
      isNewStudent = true;
    }

    // Fetch updated user to get the new role
    const updatedUser = await authModel.findById(studentID);
    if (updatedUser && updatedUser.role === "student") {
      // Generate new token with updated role
      const newToken = jwt.sign(
        { id: updatedUser._id, role: updatedUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "6h" }
      );

      if (isNewStudent) {
        return res.status(201).json({
          success: true,
          message: "Registered as new student successfully",
          data: student,
          token: newToken,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: student,
        token: newToken,
      });
    }

    if (isNewStudent) {
      return res.status(201).json({
        success: true,
        message: "Registered as new student successfully",
        data: student,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const getSelfStudent = async (req, res) => {
  try {
    const student = await studentModel.findOne({ studentID: req.user.id });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student record not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Student record found",
      data: student,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  upsertSelfStudent,
  getSelfStudent,
};
