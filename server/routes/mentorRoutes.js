import express from "express";
import { authenticate, authorizeMentor } from "../middlewares/authMiddleware.js";
import {
  getSelfMentor,
  upsertSelfMentor,
  getAllMentors,
  getMentor,
  updateMentor,
} from "../controllers/mentorController.js";

const router = express.Router();

// Logged-in Mentor self profile management (Protected)
router.get("/profile", authenticate, authorizeMentor, getSelfMentor);
router.put("/profile", authenticate, authorizeMentor, upsertSelfMentor);

// Public / Student Mentor Directory Discovery
router.get("/", getAllMentors);
router.get("/:id", getMentor);

// Mentors can update specific mentor profiles by ID (Protected)
router.put("/:id", authenticate, authorizeMentor, updateMentor);

export default router;
