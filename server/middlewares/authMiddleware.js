import jwt from "jsonwebtoken";
import authModel from "../models/authModel.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "401 Unauthorized: Access denied, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch up-to-date role from DB if needed
    if (decoded.id && !req.user.role) {
      const user = await authModel.findById(decoded.id).select("role name email");
      if (user) {
        req.user.role = user.role;
      }
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "401 Unauthorized: Invalid or expired token",
    });
  }
};

export const authorizeStudent = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "401 Unauthorized: Authentication required",
    });
  }

  let role = req.user.role;
  if (role !== "student") {
    // Double-check real-time role in DB
    const user = await authModel.findById(req.user.id);
    if (user) role = user.role;
  }

  if (role !== "student") {
    return res.status(403).json({
      success: false,
      message: "403 Forbidden: Access denied, student role required",
    });
  }

  next();
};

export const authorizeMentor = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "401 Unauthorized: Authentication required",
    });
  }

  let role = req.user.role;
  if (role !== "mentor") {
    const user = await authModel.findById(req.user.id);
    if (user) role = user.role;
  }

  if (role !== "mentor") {
    return res.status(403).json({
      success: false,
      message: "403 Forbidden: Access denied, mentor role required",
    });
  }

  next();
};

// Aliases for backwards compatibility if needed
export const verifyToken = authenticate;
