const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  clientAddress: { type: String, required: true },
  taxId: { type: String, required: true },
  servicesOffered: {
    type: String,
    enum: ["logistics", "transportation"],
    required: true,
  },
  clientLogo: { type: String },
  budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: "ClientBudget" }],
  admins: { type: [mongoose.Schema.Types.ObjectId], ref: "Admin", default: [] },
  drivers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Driver",
    default: [],
  },
  vehicles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Vehicle",
    default: [],
  },
  role: { type: String, default: "superAdmin" },
  isVerified: { type: Boolean, default: false },
  registrationTime: { type: Date, default: Date.now },
  otp: { type: String },
  otpExpiry: { type: Date },
});

const ClientModel = mongoose.model("Clients", ClientSchema);

module.exports = ClientModel;
