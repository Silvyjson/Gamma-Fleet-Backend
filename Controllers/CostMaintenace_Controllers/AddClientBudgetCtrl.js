const ClientBudgetModel = require("../../Models/ClientBudgetModel");
const ClientModel = require("../../Models/ClientModel");

const handleAddClientBudget = async (req, res) => {
  try {
    const { amount } = req.body;
    const clientId = req.client.id;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

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

    const existingBudget = await ClientBudgetModel.findOne({
      Client_id: clientId,
      createdMonth: currentMonth,
    });

    if (existingBudget) {
      return res
        .status(400)
        .json({ message: "Budget already exists for this month" });
    }

    const newBudget = new ClientBudgetModel({
      amount,
      Client_id: clientId,
    });

    await newBudget.save();

    const client = await ClientModel.findById(clientId);
    client.budgets.push(newBudget._id);
    await client.save();

    return res
      .status(200)
      .json({ message: "Budget added successfully", newBudget });
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = { handleAddClientBudget };
