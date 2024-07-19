const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  profileImg: { type: String },
  role: { type: String, default: "admin" },
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clients" },
  registrationTime: { type: Date, default: Date.now },
});

const AdminModel = mongoose.model("Admin", AdminSchema);

module.exports = AdminModel;
