const TripModel = require("../../Models/TripModel");
const DriverModel = require("../../Models/DriverModel");
const { handlegenerateId } = require("../Utilities/GenerateId");

const handleCreateTrip = async (req, res) => {
  try {
    const { from, to, distance, startTime, driverId } = req.body;

    const tripId = await handlegenerateId();

    const newTrip = new TripModel({
      tripId,
      location: { from, to },
      distance,
      startTime,
      driver: driverId,
    });

    await newTrip.save();

    const driver = await DriverModel.findById(driverId);
    driver.trips.push(newTrip._id);
    await driver.save();

    return res
      .status(200)
      .json({ message: "Trip created successfully", newTrip });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleCreateTrip };
