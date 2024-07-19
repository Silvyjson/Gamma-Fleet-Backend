const mongoose = require("mongoose");

const DriverBudgetSchema = new mongoose.Schema({
  assignedBudget: { type: Number, required: true, min: 0 },
  balance: { type: Number, required: true, min: 0 },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  tripDetails: [
    {
      tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true,
      },
      fuelCost: { type: Number, required: true, min: 0 },
      date: { type: Date, required: true },
    },
  ],
  month: { type: Date, required: true },
  createdTime: { type: Date, default: Date.now },
});

DriverBudgetSchema.pre("save", function (next) {
  const totalFuelCost = this.tripDetails.reduce(
    (acc, trip) => acc + trip.fuelCost,
    0
  );
  this.balance = this.assignedBudget - totalFuelCost;
  if (this.balance < 0) {
    const error = new Error("Balance cannot be negative");
    return next(error);
  }
  next();
});

const DriverBudgetModel = mongoose.model("DriverBudget", DriverBudgetSchema);

module.exports = DriverBudgetModel;
