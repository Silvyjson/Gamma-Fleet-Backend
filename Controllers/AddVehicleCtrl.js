const mongoose = require("mongoose");
const VehicleModel = require("../Models/VehicleModel");
const ClientModel = require("../Models/ClientModel");
const DriverModel = require("../Models/DriverModel");

const handleAddVehicle = async (req, res) => {
  try {
    const { vehicleNumber, make, model, year, capacity, driverEmail } =
      req.body;
    const clientId = req.client.id;

    if (
      !vehicleNumber ||
      !make ||
      !model ||
      !year ||
      !capacity ||
      !driverEmail
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVehicle = await VehicleModel.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res
        .status(400)
        .json({ message: "Vehicle number already registered" });
    }

    const driver = await DriverModel.findOne({ email: driverEmail });
    if (!driver) {
      return res.status(400).json({ message: "Driver not found" });
    }

    const newVehicle = new VehicleModel({
      vehicleNumber,
      make,
      model,
      year,
      capacity,
      driver_id: driver._id,
      client_id: clientId,
    });

    await newVehicle.save();

    const client = await ClientModel.findById(clientId);
    if (client) {
      client.vehicles.push(newVehicle._id);
      await client.save();
    }

    await DriverModel.findByIdAndUpdate(
      driver._id,
      { assignedVehicle: newVehicle._id },
      { new: true }
    );

    return res.status(200).json({
      message: "Vehicle added successfully",
      newVehicle,
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleAddVehicle };
