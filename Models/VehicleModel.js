const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  capacity: { type: Number, required: true },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  maintenanceRecords: { type: [String] },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  registrationTime: { type: Date, default: Date.now },
});

const VehicleModel = mongoose.model("Vehicle", VehicleSchema);

module.exports = VehicleModel;
