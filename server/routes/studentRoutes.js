import express from "express";
import {
  upsertSelfStudent,
  getSelfStudent,
} from "../controllers/studentController.js";
import { authenticate, authorizeStudent } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

const validation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .isInt({ min: 1 })
    .withMessage("Age must be a positive integer")
    .notEmpty()
    .withMessage("Age is required"),

  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be 'Male' or 'Female'")
    .notEmpty()
    .withMessage("Gender is required"),

  body("phone")
    .isNumeric()
    .withMessage("Phone must be a number")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
];

router.post("/", authenticate, authorizeStudent, validation, upsertSelfStudent);

router.get("/", authenticate, authorizeStudent, getSelfStudent);

export default router;
