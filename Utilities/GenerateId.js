let generatedTripId = new Set();
let generatedVehicleId = new Set();

const handlegenerateTripId = () => {
  while (true) {
    const randomNumber = Math.floor(Math.random() * 1000000000);

    const uniqueNumber = "1" + randomNumber.toString().padStart(6, "0");

    if (!generatedTripId.has(uniqueNumber)) {
      generatedTripId.add(uniqueNumber);
      return uniqueNumber;
    }
  }
};

const handlegenerateVehicleId = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  while (true) {
    const randomNumber = Math.floor(Math.random() * 1000000000);
    const uniqueNumber = "1" + randomNumber.toString().padStart(5, "0");

    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    const uniqueNumberWithLetter =
      uniqueNumber.slice(0, -1) + randomLetter + uniqueNumber.slice(-1);

    if (!generatedVehicleId.has(uniqueNumberWithLetter)) {
      generatedVehicleId.add(uniqueNumberWithLetter);
      return uniqueNumberWithLetter;
    }
  }
};

module.exports = { handlegenerateTripId, handlegenerateVehicleId };
