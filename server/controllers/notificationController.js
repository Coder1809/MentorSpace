import notificationModel from "../models/notificationModel.js";
import authModel from "../models/authModel.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all notifications for user
    const notifications = await notificationModel
      .find({ recipientID: userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await notificationModel.countDocuments({
      recipientID: userId,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: err.message,
    });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await notificationModel.updateMany(
      { recipientID: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
      error: err.message,
    });
  }
};

export const markSingleNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationModel.findOneAndUpdate(
      { _id: id, recipientID: userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: err.message,
    });
  }
};
