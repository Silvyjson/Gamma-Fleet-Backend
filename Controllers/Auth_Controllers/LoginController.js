const ClientModel = require("../../Models/ClientModel");
const AdminModel = require("../../Models/AdminModel");
const DriverModel = require("../../Models/DriverModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await ClientModel.findOne({ email });

    if (!user) {
      user = await AdminModel.findOne({ email });
    }

    if (!user) {
      user = await DriverModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isVerified === false && user.role == "superAdmin") {
      return res.status(403).json({
        message:
          "Email not verified. Please check your inbox for the verification email.",
      });
    }

    const token = jwt.sign({ userId: user }, process.env.JWT_TOKEN, {
      expiresIn: "7h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleLogin };
