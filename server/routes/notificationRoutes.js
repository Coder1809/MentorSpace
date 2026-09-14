import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getUserNotifications,
  markAllNotificationsRead,
  markSingleNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authenticate, getUserNotifications);
router.put("/read", authenticate, markAllNotificationsRead);
router.put("/:id/read", authenticate, markSingleNotificationRead);

export default router;
