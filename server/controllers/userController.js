import authModel from "../models/authModel.js";

//User Routes
const getUserInfo = async (req, res) => {
  const id = req.user.id;

  try {
    const userData = await authModel.findById(id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Info retrieved",
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error retriving data",
    });
  }
};

export { getUserInfo };
