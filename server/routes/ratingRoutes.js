import express from "express";
import { authenticate, authorizeStudent } from "../middlewares/authMiddleware.js";
import {
  submitRating,
  getMentorRatings,
  getAppointmentRating,
} from "../controllers/ratingController.js";

const router = express.Router();

// Student submits a rating for a completed session
router.post("/", authenticate, authorizeStudent, submitRating);

// Public — get aggregate rating for a mentor
router.get("/mentor/:mentorId", getMentorRatings);

// Check if a specific appointment has been rated
router.get("/appointment/:appointmentId", authenticate, getAppointmentRating);

export default router;
