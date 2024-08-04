const VehicleModel = require("../Models/VehicleModel");
const ClientModel = require("../Models/ClientModel");
const DriverModel = require("../Models/DriverModel");
const { handlegenerateId } = require("../Utilities/GenerateId");

const handleAddVehicle = async (req, res) => {
  try {
    const {
      vehicleName,
      model,
      chassisNumber,
      productType,
      purchaseDate,
      permitType,
      ownersName,
      ownersLicense,
      ownersAddress: { addressLine, state, country },
      assignedDriver,
      insurance: insuranceString,
      insuranceDueDate,
    } = req.body;

    const insurance = insuranceString === "Yes";

    const clientId = req.client.id;

    if (
      !vehicleName ||
      !model ||
      !chassisNumber ||
      !productType ||
      !purchaseDate ||
      !permitType ||
      !ownersName ||
      !ownersLicense ||
      !addressLine ||
      !state ||
      !country ||
      !assignedDriver ||
      insurance === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicleId = await handlegenerateId();

    const existingVehicle = await VehicleModel.findOne({ chassisNumber });
    if (existingVehicle) {
      return res.status(400).json({
        message: "Vehicle with the chassis number already registered",
      });
    }

    const driver = await DriverModel.findById(assignedDriver);
    const driverName = driver.fullName;

    console.log(driver);

    const newVehicle = new VehicleModel({
      vehicleId,
      vehicleName,
      model,
      chassisNumber,
      productType,
      purchaseDate,
      permitType,
      ownersName,
      ownersLicense,
      ownersAddress: {
        addressLine,
        state,
        country,
      },
      assignedDriver: {
        driver_id: assignedDriver,
        driverName: driverName,
      },
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

    await DriverModel.findByIdAndUpdate(
      assignedDriver,
      {
        $push: { assignedVehicle: newVehicle._id },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Vehicle added successfully",
      newVehicle,
    });
  } catch (error) {
    console.error("Error in handleAddVehicle:", error);
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
