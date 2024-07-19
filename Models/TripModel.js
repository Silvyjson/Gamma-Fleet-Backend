const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  tripId: { type: String, required: true, unique: true },
  location: {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  distance: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ["new", "ongoing", "completed"],
    default: "new",
  },
  expenses: { type: Number, default: 0 },
  driverPerformancePoint: { type: Number, default: 0 },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  createdTime: { type: Date, default: Date.now },
});

const TripModel = mongoose.model("Trip", TripSchema);

module.exports = TripModel;
