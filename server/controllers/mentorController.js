import { validationResult } from "express-validator";
import mentorModel from "../models/mentorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import ratingModel from "../models/ratingModel.js";
import authModel from "../models/authModel.js";
import mongoose from "mongoose";

const getSelfMentor = async (req, res) => {
  const mentorID = req.user.id;

  try {
    const mentor = await mentorModel.findOne({ mentorID });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found. Please complete your profile setup.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mentor profile retrieved",
      data: mentor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching mentor profile",
      error: err.message,
    });
  }
};

const upsertSelfMentor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const mentorID = req.user.id;

  try {
    let mentor = await mentorModel.findOneAndUpdate({ mentorID }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!mentor) {
      const user = await authModel.findById(mentorID);
      mentor = await mentorModel.create({
        ...req.body,
        mentorID: user?._id || mentorID,
        name: req.body.name || user?.name || "Mentor",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mentor profile updated successfully",
      data: mentor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update mentor profile",
      error: err.message,
    });
  }
};

const addMentor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  if (
    !req.body.mentorID ||
    !mongoose.Types.ObjectId.isValid(req.body.mentorID)
  ) {
    return res.status(400).json({
      success: false,
      message: "mentorID (user _id) is required and must be valid",
    });
  }

  try {
    const mentor = new mentorModel(req.body);
    await mentor.save();

    return res.status(201).json({
      success: true,
      message: "Mentor created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't create mentor",
      error: err,
    });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const mentors = await mentorModel.find({}).lean();

    // Aggregate ratings for all mentors in a single query
    const ratingsAgg = await ratingModel.aggregate([
      {
        $group: {
          _id: "$mentorID",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    // Build a lookup map for O(1) access
    const ratingsMap = {};
    ratingsAgg.forEach((r) => {
      ratingsMap[r._id.toString()] = {
        averageRating: Math.round(r.averageRating * 10) / 10,
        totalRatings: r.totalRatings,
      };
    });

    // Enrich each mentor with their real rating data
    const enrichedMentors = mentors.map((m) => {
      const ratingData = ratingsMap[m._id.toString()] || {
        averageRating: 0,
        totalRatings: 0,
      };
      return { ...m, ...ratingData };
    });

    return res.status(200).json({
      success: true,
      message: "All mentors retrieved",
      data: enrichedMentors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};

const getMentor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    const mentor = await mentorModel.findOne({
      $or: [{ mentorID: id }, { _id: id }],
    }).lean();

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const ratingAgg = await ratingModel.aggregate([
      { $match: { mentorID: mentor._id } },
      {
        $group: {
          _id: "$mentorID",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const ratingData = ratingAgg[0] || { averageRating: 0, totalRatings: 0 };
    mentor.averageRating = Math.round(ratingData.averageRating * 10) / 10;
    mentor.totalRatings = ratingData.totalRatings;

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved",
      data: mentor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't retrieve",
      error: err.message || err,
    });
  }
};

const updateMentor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  try {
    const updated = await mentorModel.findOneAndUpdate(
      { $or: [{ mentorID: id }, { _id: id }] },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Updated mentor",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err,
    });
  }
};

const deleteMentor = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  try {
    const deleted = await mentorModel.findOneAndDelete({
      $or: [{ mentorID: id }, { _id: id }],
    });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await appointmentModel.updateMany(
      { mentorID: deleted._id, date: { $gte: today } },
      { $set: { status: "Cancelled" } }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err,
    });
  }
};

export {
  getSelfMentor,
  upsertSelfMentor,
  addMentor,
  getAllMentors,
  getMentor,
  updateMentor,
  deleteMentor,
};
