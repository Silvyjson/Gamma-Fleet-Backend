const jwt = require("jsonwebtoken");
const ClientModel = require("../Models/ClientModel");

// Function to delete unverified users with expired tokens
const deleteNonverifiedUsers = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const unverifiedUsers = await ClientModel.find({
      isVerified: false,
      registrationTime: { $lt: oneHourAgo },
    });

    for (const user of unverifiedUsers) {
      await ClientModel.findByIdAndDelete(user._id);
      console.log(`Deleted unverified user with ID: ${user._id}`);
    }
  } catch (error) {
    console.error("Error deleting unverified users:", error.message);
  }
};

module.exports = deleteNonverifiedUsers;
