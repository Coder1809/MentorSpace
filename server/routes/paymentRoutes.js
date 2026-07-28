import express from "express";
import { body } from "express-validator";
import { authenticate, authorizeStudent } from "../middlewares/authMiddleware.js";
import { createRateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";
import {
  createOrder,
  verifyPayment,
  getTransactions,
} from "../controllers/paymentController.js";

const validateCreateOrder = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .notEmpty()
    .withMessage("Amount is required"),
];

const router = express.Router();

const paymentRateLimit = createRateLimitMiddleware({
  identifier: "user",
  envKey: "RATE_LIMIT_PAYMENT",
});

router.post(
  "/create-order",
  authenticate,
  authorizeStudent,
  paymentRateLimit,
  validateCreateOrder,
  createOrder
);

router.post(
  "/verify",
  authenticate,
  authorizeStudent,
  paymentRateLimit,
  verifyPayment
);

// Fallback compatibility route for save-transaction
router.post(
  "/save-transaction",
  authenticate,
  authorizeStudent,
  paymentRateLimit,
  verifyPayment
);

router.get("/", authenticate, paymentRateLimit, getTransactions);

export default router;
