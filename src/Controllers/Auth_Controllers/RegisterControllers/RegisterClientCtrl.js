const ClientModel = require("../../../Models/ClientModel");
const AdminModel = require("../../../Models/AdminModel");
const DriverModel = require("../../../Models/DriverModel");
const SendEmail = require("../../../Utilities/SendEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { VerificationMail } = require("../../../Utilities/Mail");

const handleRegisterClient = async (req, res) => {
  try {
    const {
      email,
      password,
      clientName,
      clientAddress,
      taxId,
      servicesOffered,
    } = req.body;

    if (
      !email ||
      !password ||
      !clientName ||
      !clientAddress ||
      !taxId ||
      !servicesOffered
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(1000, 9999).toString();

    const existingAdmin = await AdminModel.findOne({ email });
    const existingClient = await ClientModel.findOne({ email });
    const existingDriver = await DriverModel.findOne({ email });

    if (existingClient || existingAdmin || existingDriver) {
      if (existingClient && existingClient.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else if (existingClient) {
        existingClient.password = hashedPassword;
        existingClient.clientName = clientName;
        existingClient.clientAddress = clientAddress;
        existingClient.taxId = taxId;
        existingClient.servicesOffered = servicesOffered;
        existingClient.otp = otp;
        existingClient.otpExpiry = Date.now() + 3600000;

        await existingClient.save();

        const subject = "Verification Mail";
        const message = VerificationMail(clientName, otp);

        await SendEmail(email, subject, message);

        const token = jwt.sign(
          { user: existingClient },
          process.env.JWT_TOKEN,
          {
            expiresIn: "7h",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Strict",
          maxAge: 7 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          message:
            "New OTP has been sent to your email address. Please verify your account.",
          token,
        });
      }
    } else {
      const newClient = new ClientModel({
        email,
        password: hashedPassword,
        clientName,
        clientAddress,
        taxId,
        servicesOffered,
        otp,
        otpExpiry: Date.now() + 3600000,
      });

      const token = jwt.sign({ user: newClient }, process.env.JWT_TOKEN, {
        expiresIn: "7h",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 60 * 60 * 1000,
      });

      const savedClient = await newClient.save();

      const subject = "Verification Mail";
      const message = VerificationMail(clientName, otp);

      await SendEmail(email, subject, message);

      const { password: _, ...safeClient } = savedClient.toObject();

      return res.status(200).json({
        message:
          "Client registered successfully, a verification mail has been sent to your email address",
        newClient: safeClient,
        token,
      });
    }
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleVerifyClient = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const user = await ClientModel.findById(req.client.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully", user });
  } catch (error) {
    console.error("Error in handleVerifyClient:", error);
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGenerateNewOTP = async (req, res) => {
  try {
    const user = await ClientModel.findById(req.client.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 3600000;

    const savedUser = await user.save();

    const subject = "Verification Mail";
    const OTP = otp;
    const message = VerificationMail(user.clientName, OTP);

    if (savedUser) {
      await SendEmail(user.email, subject, message);
    }

    return res.status(200).json({ message: "otp generated successfully" });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGetClient = async (req, res) => {
  try {
    const clientId = req.client.id;

    const client = await ClientModel.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({ client });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = {
  handleRegisterClient,
  handleVerifyClient,
  handleGenerateNewOTP,
  handleGetClient,
};
