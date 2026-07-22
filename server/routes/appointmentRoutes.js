import express from "express";
import { authenticate, authorizeStudent, authorizeMentor } from "../middlewares/authMiddleware.js";
import {
  getAppointment,
  createAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";
import { body } from "express-validator";

const validation = [
  body("mentorID").isMongoId().withMessage("Invalid mentor ID"),
  body("date")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format")
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error("Date cannot be in the past");
      }
      return true;
    }),
  body("reason")
    .isString()
    .withMessage("Reason must be a string")
    .notEmpty()
    .withMessage("Reason is required")
    .isLength({ max: 200 })
    .withMessage("Reason too long"),
  body("timeSlot")
    .isString()
    .isIn(["Morning", "Afternoon", "Evening"])
    .withMessage("Timeslot provided is invalid"),
];

const router = express.Router();

router.get("/", authenticate, getAppointment);

router.post("/", authenticate, authorizeStudent, validation, createAppointment);

router.put("/:id", authenticate, authorizeMentor, updateAppointment);

export default router;
