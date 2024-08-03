const mongoose = require("mongoose");
const VehicleModel = require("../Models/VehicleModel");
const ClientModel = require("../Models/ClientModel");
const DriverModel = require("../Models/DriverModel");
const { handlegenerateId } = require("../Utilities/GenerateId");

const handleAddVehicle = async (req, res) => {
  try {
    const {
      VehicleName,
      Model,
      ChassisNumber,
      productType,
      purchaseDate,
      permitType,
      ownersName,
      ownersLicense,
      addressLine,
      state,
      country,
      AssignedDriver,
      insurance,
      insuranceDueDate,
    } = req.body;

    const clientId = req.client.id;

    if (
      !VehicleName ||
      !Model ||
      !ChassisNumber ||
      !productType ||
      !purchaseDate ||
      !permitType ||
      !ownersName ||
      !ownersLicense ||
      !addressLine ||
      !state ||
      !country ||
      !AssignedDriver ||
      insurance === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const VehicleId = await handlegenerateId();

    const existingVehicle = await VehicleModel.findOne({ VehicleId });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle already registered" });
    }

    const newVehicle = new VehicleModel({
      VehicleId,
      VehicleName,
      Model,
      ChassisNumber,
      productType,
      purchaseDate,
      permitType,
      ownersName,
      ownersLicense,
      OwnersAddress: {
        addressLine,
        state,
        country,
      },
      AssignedDriver,
      insurance,
      insuranceDueDate: insurance ? insuranceDueDate : null,
      client_id: clientId,
    });

    await newVehicle.save();

    const client = await ClientModel.findById(clientId);
    if (client) {
      client.vehicles.push(newVehicle._id);
      await client.save();
    }

    return res.status(200).json({
      message: "Vehicle added successfully",
      newVehicle,
    });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGetAllVehicle = async (req, res) => {
  try {
    const clientId = req.client.id;
    const vehicles = await VehicleModel.find({ client_id: clientId });

    if (!vehicles.length === 0) {
      return res.status(200).json({ message: "No vehicles found" });
    }

    return res.status(200).json({ vehicles });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGetOneVehicle = async (req, res) => {
  try {
    const clientId = req.client.id;

    const vehicleId = req.params.id;

    const vehicle = await VehicleModel.findOne({
      client_id: clientId,
      _id: vehicleId,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json({ vehicle });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleAddVehicle, handleGetAllVehicle, handleGetOneVehicle };
