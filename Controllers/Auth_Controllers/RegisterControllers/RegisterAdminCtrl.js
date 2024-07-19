const AdminModel = require("../../../Models/AdminModel");
const ClientModel = require("../../../Models/ClientModel");
const DriverModel = require("../../../Models/DriverModel");
const SendEmail = require("../../../Utilities/SendEmail");
const { InvitationMail } = require("../../../View/mailDetails");
const bcrypt = require("bcrypt");

const handleRegisterAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, address } = req.body;
    const clientId = req.client.id;

    if (!fullName || !phoneNumber || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await AdminModel.findOne({ email: email });
    const existingclient = await ClientModel.findOne({ email: email });
    const existingDriver = await DriverModel.findOne({ email: email });

    if (existingAdmin || existingclient || existingDriver) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      client_id: clientId,
    });

    await newAdmin.save();

    const client = await ClientModel.findById(clientId);

    client.admins.push(newAdmin._id);
    await client.save();

    const subject = "Admin Registration Invitation";
    const inviteLink = `http://localhost:8008/api/login`;
    const message = InvitationMail(
      fullName,
      client.clientName,
      email,
      password,
      inviteLink
    );

    await SendEmail(email, subject, message);

    return res.status(200).json({
      message:
        "Admin invited successfully, an invite email has been sent to the Admin",
      newAdmin,
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleRegisterAdmin };
