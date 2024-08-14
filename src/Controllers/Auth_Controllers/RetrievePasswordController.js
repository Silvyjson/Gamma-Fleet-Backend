const ClientModel = require("../../Models/ClientModel");
const AdminModel = require("../../Models/AdminModel");
const DriverModel = require("../../Models/DriverModel");
const SendEmail = require("../../Utilities/SendEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ResetPasswordMail } = require("../../Utilities/Mail");

const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (
      !email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check if the user exists in any of the models
    const client = await ClientModel.findOne({ email });
    const admin = await AdminModel.findOne({ email });
    const driver = await DriverModel.findOne({ email });

    if (!client && !admin && !driver) {
      return res.status(404).json({ error_message: "User not found" });
    }

    const userType = client ? "Client" : admin ? "Admin" : "Driver";
    const userId = client ? client._id : admin ? admin._id : driver._id;

    const token = jwt.sign({ userId, userType }, process.env.JWT_TOKEN, {
      expiresIn: "10m",
    });

    const subject = "Reset Password Mail";

    // URL to the frontend with the token as a query parameter
    const ResetLink = `https://backend-youthrive-wallet-management.onrender.com/api/resetPassword?token=${token}`;

    const message = ResetPasswordMail(userType, ResetLink);

    await SendEmail(email, subject, message);

    return res
      .status(200)
      .json({ message: "Reset password link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error_message: "Something went wrong" });
    }

    const { password } = req.body;

    if (
      !password ||
      password.length < 6 ||
      !/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[$#&])/.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and must contain at least one number, one uppercase and one special character",
      });
    }

    const { userId, userType } = jwt.verify(token, process.env.JWT_TOKEN);

    let user;
    switch (userType) {
      case "Client":
        user = await ClientModel.findById(userId);
        break;
      case "Admin":
        user = await AdminModel.findById(userId);
        break;
      case "Driver":
        user = await DriverModel.findById(userId);
        break;
      default:
        return res.status(400).json({ message: "Invalid token" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = {
  handleForgotPassword,
  handleResetPassword,
};
