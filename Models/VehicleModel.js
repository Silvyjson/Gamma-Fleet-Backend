const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  VehicleName: { type: String, required: true },
  model: { type: String, required: true },
  ChassisNumber: { type: String, required: true, unique: true },
  productType: {
    type: String,
    required: true,
    enum: ["Sedan", "SUV", "Truck", "Van", "Coupe", "Coach"],
  },
  purchaseDate: { type: Date, required: true },
  permitType: {
    type: String,
    required: true,
    enum: ["Commercial", "Personal", "Government", "Rental", "Emergency"],
  },
  ownersName: { type: String, required: true },
  ownersLicense: { type: String, required: true },
  address: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  insurance: { type: Boolean, required: true },
  insuranceDueDate: { type: Date },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  maintenanceRecords: { type: [String] },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  registrationTime: { type: Date, default: Date.now },
});

const VehicleModel = mongoose.model("Vehicle", VehicleSchema);

module.exports = VehicleModel;
