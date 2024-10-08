const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vehicleName: { type: String, required: true },
  vehicleId: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  chassisNumber: { type: String, required: true, unique: true },
  productType: {
    type: String,
    required: true,
    enum: ["Sedan", "SUV", "Truck", "Van", "Coach"],
  },
  purchaseDate: { type: Date, required: true },
  permitType: {
    type: String,
    required: true,
    enum: ["Commercial", "Personal", "Government", "Rental", "Emergency"],
  },
  ownersName: { type: String, required: true },
  ownersLicense: { type: String, required: true },
  ownersAddress: {
    addressLine: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  insurance: { type: String, required: true },
  insuranceDueDate: { type: Date },
  assignedDriver: {
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    driverName: { type: String, required: true },
  },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  maintenanceRecords: { type: [String] },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Idle", "Waiting"],
    default: "Active",
  },
  trips: { type: [mongoose.Schema.Types.ObjectId], ref: "Trip", default: [] },
  registrationTime: { type: Date, default: Date.now },
});

const VehicleModel = mongoose.model("Vehicle", VehicleSchema);

module.exports = VehicleModel;
