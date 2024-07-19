const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");

const AuthRoutes = require("./Routes/AuthRoutes");
const Routes = require("./Routes/OtherRoutes");
const Documentation = require("./VIEW/documentation");
const deleteNonverifiedUsers = require("./Utilities/DeleteNonverifiedUsers");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(() => console.log("Failed to connect to MongoDB"));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// scheduled tasks to delete unverified user accounts with expired token
cron.schedule("* * * * *", async () => {
  console.log("Running delete unverified users with expired tokens...");
  await deleteNonverifiedUsers();
});

app.get("/", (req, res) => {
  res.send(Documentation);
});

app.use("/api/", AuthRoutes);
app.use("/api/", Routes);

app.use((req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});
