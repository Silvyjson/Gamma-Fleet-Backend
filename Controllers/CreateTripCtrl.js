const TripModel = require("../../Models/TripModel");
const DriverModel = require("../../Models/DriverModel");
const { handlegenerateId } = require("../Utilities/GenerateId");

const handleCreateTrip = async (req, res) => {
  try {
    const { from, to, distance, startTime, driverId } = req.body;

    const tripId = await handlegenerateId();

    const Driver = await DriverModel.findById(driverId);
    const driverName = Driver.fullName;

    const newTrip = new TripModel({
      tripId,
      location: { from, to },
      distance,
      startTime,
      driver: {
        driver_id: driverId,
        driverName: driverName,
      },
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

const handleGetTrips = async (req, res) => {
  try {
    const clientId = req.client.id;

    const trips = await TripModel.find({
      client_id: clientId,
    });

    if (!trips) {
      return res.status(404).json({ message: "No trips found" });
    }

    return res.status(200).json({ trips });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

const handleGetDriverTrips = async (req, res) => {
  try {
    const clientId = req.client.id;

    const driverId = req.params.id;

    const driverTrips = await TripModel.findOne({
      client_id: clientId,
      _id: driverId,
    });

    if (!driverTrips) {
      return res.status(404).json({ message: "No trips found" });
    }

    return res.status(200).json({ driverTrips });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleCreateTrip, handleGetTrips, handleGetDriverTrips };
