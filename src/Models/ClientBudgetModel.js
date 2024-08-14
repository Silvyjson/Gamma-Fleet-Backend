const mongoose = require("mongoose");

const ClientBudgetSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  fuelCost: { type: Number, default: 0 },
  vehicleMaintenanceCost: { type: Number, default: 0 },
  balance: { type: Number },
  Client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
  },
  createdMonth: { type: String },
  createdTime: { type: Date, default: Date.now },
});

ClientBudgetSchema.index({ Client_id: 1, createdMonth: 1 }, { unique: true });

ClientBudgetSchema.pre("save", function (next) {
  this.balance = this.amount - this.fuelCost - this.vehicleMaintenanceCost;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = months[new Date().getMonth()];
  this.createdMonth = currentMonth;
  next();
});

const ClientBudgetModel = mongoose.model("ClientBudget", ClientBudgetSchema);

module.exports = ClientBudgetModel;
