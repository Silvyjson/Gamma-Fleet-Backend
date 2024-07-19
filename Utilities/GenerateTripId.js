let generatedTripId = new Set();

const handlegenerateTripId = () => {
  while (true) {
    const randomNumber = Math.floor(Math.random() * 1000000000);

    const uniqueNumber = "1" + randomNumber.toString().padStart(4, "0");

    if (!generatedTripId.has(uniqueNumber)) {
      generatedTripId.add(uniqueNumber);
      return uniqueNumber;
    }
  }
};

module.exports = handlegenerateTripId;
