let generatedId = new Set();

const handlegenerateId = () => {
  while (true) {
    const randomNumber = Math.floor(Math.random() * 1000000000);

    const uniqueNumber = "2" + randomNumber.toString().padStart(5, "0");

    if (!generatedId.has(uniqueNumber)) {
      generatedId.add(uniqueNumber);
      return uniqueNumber;
    }
  }
};

module.exports = { handlegenerateId };
