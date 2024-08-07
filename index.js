const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const AuthRoutes = require("./Routes/AuthRoutes");
const Routes = require("./Routes/OtherRoutes");
const Documentation = require("./View/documentation");
const deleteNonverifiedUsers = require("./Utilities/DeleteNonverifiedUsers");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://silvyjson.github.io",
      "https://silvyjson.github.io/Gamma-Fleet/",
    ],
    credentials: true,
  })
);
app.use(helmet());

const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Mongodb connected and server is running on port ${PORT}`);
    });
  })
  .catch(() => console.log("Failed to connect to MongoDB"));

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error_message: err.message });
});
