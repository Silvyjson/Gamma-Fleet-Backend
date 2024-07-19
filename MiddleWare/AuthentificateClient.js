const jwt = require("jsonwebtoken");
const ClientModel = require("../Models/ClientModel");

const AuthenticateClient = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_TOKEN);

    if (!verifiedToken) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const client = await ClientModel.findById(verifiedToken.userId);

    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    req.client = {
      id: client._id,
      name: client.clientName,
      email: client.email,
    };

    next();
  } catch (error) {
    return res.status(500).json({ error_message: error.message });
  }
};

module.exports = AuthenticateClient;
