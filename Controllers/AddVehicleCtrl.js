const mongoose = require("mongoose");
const VehicleModel = require("../Models/VehicleModel");
const ClientModel = require("../Models/ClientModel");
const DriverModel = require("../Models/DriverModel");

const handleAddVehicle = async (req, res) => {
  try {
    const {
      VehicleName,
      model,
      ChassisNumber,
      productType,
      purchaseDate,
      permitType,
      ownersName,
      ownersLicense,
      addressLine1,
      addressLine2,
      state,
      country,
      insurance,
      insuranceDueDate,
      driverEmail,
    } = req.body;

    const clientId = req.client.id;

    if (
      !VehicleName ||
      !model ||
      !ChassisNumber ||
      !productType ||
      !purchaseDate ||
      !permitType ||
      !ownersName ||
      !ownersLicense ||
      !addressLine1 ||
      !state ||
      !country ||
      insurance === undefined ||
      !driverEmail
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingVehicle = await VehicleModel.findOne({ VehicleName });
    if (existingVehicle) {
      return res
        .status(400)
        .json({ message: "Chassis number already registered" });
    }

    const driver = await DriverModel.findOne({ email: driverEmail });
    if (!driver) {
      return res.status(400).json({ message: "Driver not found" });
    }

    const newVehicle = new VehicleModel({
      VehicleName,
      model,
      ChassisNumber,
      productType,
      purchaseDate,
      permitType,
      ownersName,
      ownersLicense,
      address: {
        addressLine1,
        addressLine2,
        state,
        country,
      },
      insurance,
      insuranceDueDate: insurance ? insuranceDueDate : null,
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
