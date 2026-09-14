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
      const skillsArray = typeof req.body.skills === "string"
        ? req.body.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : req.body.skills || [];

      const languagesArray = typeof req.body.languages === "string"
        ? req.body.languages.split(",").map((l) => l.trim()).filter(Boolean)
        : req.body.languages || [];

      // Only store fields the user actually provided — never generate fake data
      const mentorData = {
        mentorID: savedUser._id,
        name: username,
        specialization: req.body.specialization || "General",
        skills: skillsArray.length > 0 ? skillsArray : [],
        languages: languagesArray.length > 0 ? languagesArray : [],
        profileComplete: false,
      };

      // Only set optional fields if the user actually provided them
      if (req.body.phone) mentorData.phone = req.body.phone;
      if (req.body.gender) mentorData.gender = req.body.gender;
      if (req.body.age) mentorData.age = Number(req.body.age);
      if (req.body.title) mentorData.title = req.body.title;
      if (req.body.company) mentorData.company = req.body.company;
      if (req.body.experience) mentorData.experience = req.body.experience;
      if (req.body.bio) mentorData.bio = req.body.bio;
      if (req.body.price || req.body.sessionFee) mentorData.price = Number(req.body.price || req.body.sessionFee);
      if (req.body.availability) mentorData.availability = req.body.availability;
      if (req.body.profilePhoto) mentorData.profilePhoto = req.body.profilePhoto;
      if (req.body.linkedin) mentorData.linkedin = req.body.linkedin;

      // Check if enough fields are provided for a complete profile
      if (req.body.title && req.body.specialization && req.body.experience && req.body.bio) {
        mentorData.profileComplete = true;
      }

      await mentorModel.create(mentorData);
    } else {
      const studentData = {
        studentID: savedUser._id,
        name: username,
      };

      if (req.body.age) studentData.age = Number(req.body.age);
      if (req.body.gender) studentData.gender = req.body.gender;
      if (req.body.phone) studentData.phone = req.body.phone;
      if (req.body.description) studentData.description = req.body.description;

      await studentModel.create(studentData);
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
