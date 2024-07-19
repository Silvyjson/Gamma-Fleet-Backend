const ClientModel = require("../../../Models/ClientModel");
const AdminModel = require("../../../Models/AdminModel");
const DriverModel = require("../../../Models/DriverModel");
const SendEmail = require("../../../Utilities/SendEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { VerificationMail } = require("../../../View/mailDetails");

const handleRegisterClient = async (req, res) => {
  try {
    const { clientName, email, password } = req.body;

    if (!clientName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await AdminModel.findOne({ email: email });
    const existingClient = await ClientModel.findOne({ email: email });
    const existingDriver = await DriverModel.findOne({ email: email });

    if (existingAdmin || existingClient || existingDriver) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new ClientModel({
      clientName,
      email,
      password: hashedPassword,
      phoneNumber: "",
      address: "",
      taxId: "",
      servicesOffered: "",
      clientLogo: "",
      Budgets: [],
      admins: [],
      drivers: [],
      vehicles: [],
    });

    await newClient.save();

    const token = jwt.sign({ userId: newClient._id }, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });

    const subject = "Verification Mail";
    const verificationLink = `http://localhost:8008/api/verify-client?token=${token}`;
    const message = VerificationMail(clientName, verificationLink);

    await SendEmail(email, subject, message);

    const { password: _, ...safeClient } = newClient.toObject();

    return res.status(200).json({
      message:
        "Client registered successfully, a verification mail has been sent to your email address",
      newClient: safeClient,
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleVerifyClient = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    const verificationToken = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await ClientModel.findById(verificationToken.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    if (user.isVerified === true) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleCompleteRegisterClient = async (req, res) => {
  try {
    const clientId = req.client.id;

    const { phoneNumber, address, taxId, servicesOffered, clientLogo } =
      req.body;

    if (!phoneNumber || !address || !taxId || !servicesOffered || !clientLogo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await ClientModel.findByIdAndUpdate(
      clientId,
      {
        phoneNumber,
        address,
        taxId,
        servicesOffered,
        clientLogo,
      },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Changes saved successfully",
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = {
  handleRegisterClient,
  handleVerifyClient,
  handleCompleteRegisterClient,
};
