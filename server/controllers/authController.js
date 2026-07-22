import authModel from "../models/authModel.js";
import studentModel from "../models/studentModel.js";
import mentorModel from "../models/mentorModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { username, email, password } = req.body;
  const role = req.body.role === "mentor" ? "mentor" : "student";

  try {
    const found = await authModel.findOne({ email: email.toLowerCase().trim() });
    if (found) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, try to login",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new authModel({
      name: username,
      email: email.toLowerCase().trim(),
      password: hashedPass,
      role,
    });

    const savedUser = await newUser.save();

    // Automatically initialize base profile document for student or mentor
    if (role === "mentor") {
      await mentorModel.create({
        mentorID: savedUser._id,
        name: username,
        phone: req.body.phone || `99${Date.now().toString().slice(-8)}`,
        gender: req.body.gender || "Male",
        age: req.body.age || 30,
        specialization: req.body.specialization || "React",
        experience: req.body.experience || "5+ years",
        bio: req.body.bio || "Experienced tech mentor guiding students in engineering and career growth.",
        status: "Active",
      });
    } else {
      await studentModel.create({
        studentID: savedUser._id,
        name: username,
        age: req.body.age || 22,
        gender: req.body.gender || "Male",
        phone: req.body.phone || `99${Date.now().toString().slice(-8)}`,
        description: req.body.description || "Enthusiastic student seeking mentorship.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User successfully registered",
      data: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while processing your request",
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const found = await authModel.findOne({ email: email.toLowerCase().trim() });

    if (!found) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials, please try again",
      });
    }

    const match = await bcrypt.compare(password, found.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: found._id, userId: found._id, role: found.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    return res.status(200).json({
      success: true,
      message: "User successfully logged in",
      token,
      data: {
        id: found._id,
        userId: found._id,
        name: found.name,
        email: found.email,
        role: found.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server error while processing your request: ${err.message}`,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out. Please remove the token on the client.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server error while processing logout: ${err.message}`,
    });
  }
};

export { registerUser, loginUser, logoutUser };
