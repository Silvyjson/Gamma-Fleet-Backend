const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  driverId: { type: Number, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phoneNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  performanceRate: { type: Number, default: 0 },
  assignedVehicle: {
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    vehicleName: { type: String },
    productType: { type: String },
  },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "DriverBudget" }],
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  profileImg: { type: String },
  role: { type: String, default: "driver" },
  registrationTime: { type: Date, default: Date.now },
});

const DriverModel = mongoose.model("Driver", DriverSchema);

module.exports = DriverModel;
