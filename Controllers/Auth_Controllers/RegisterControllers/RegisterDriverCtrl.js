const DriverModel = require("../../../Models/DriverModel");
const ClientModel = require("../../../Models/ClientModel");
const AdminModel = require("../../../Models/AdminModel");
const SendEmail = require("../../../Utilities/SendEmail");
const { InvitationMail } = require("../../../View/mailDetails");
const { handlegenerateId } = require("../../../Utilities/GenerateId");
const bcrypt = require("bcrypt");

const handleRegisterDriver = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, licenseNumber, address } =
      req.body;
    const clientId = req.client.id;

    if (!fullName || !phoneNumber || !licenseNumber || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDriver = await DriverModel.findOne({ email: email });
    const existingAdmin = await AdminModel.findOne({ email: email });
    const existingClient = await ClientModel.findOne({ email: email });

    if (existingAdmin || existingClient || existingDriver) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const driverId = handlegenerateId();

    const newDriver = new DriverModel({
      driverId,
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      licenseNumber,
      address,
      assignedVehicle: {
        vehicle_id: null,
        vehicleName: null,
      },
      client_id: clientId,
    });

    const savedDriver = await newDriver.save();

    const client = await ClientModel.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.drivers.push(newDriver._id);

    const savedClient = await client.save();

    const subject = "Driver Registration Invitation";
    const inviteLink = `https://silvyjson.github.io/Gamma-Fleet/signIn-page`;
    const message = InvitationMail(
      fullName,
      client.clientName,
      email,
      password,
      inviteLink
    );

    if (savedDriver && savedClient) {
      await SendEmail(email, subject, message);
    }

    return res.status(200).json({
      message:
        "Driver invited successfully, an invite email has been sent to the driver",
      newDriver,
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGetAllDriver = async (req, res) => {
  try {
    const clientId = req.client.id;
    const drivers = await DriverModel.find({ client_id: clientId });

    if (!drivers.length === 0) {
      return res.status(200).json({ message: "No drivers found" });
    }

    return res.status(200).json({ drivers });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGetOneDriver = async (req, res) => {
  try {
    const clientId = req.client.id;

    const driverId = req.params.id;

    const driver = await DriverModel.findOne({
      client_id: clientId,
      _id: driverId,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    return res.status(200).json({ driver });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = {
  handleRegisterDriver,
  handleGetAllDriver,
  handleGetOneDriver,
};
