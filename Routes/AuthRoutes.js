const express = require("express");

const AuthenticateClient = require("../MiddleWare/AuthentificateClient");
const Verification = require("../MiddleWare/Verification");
const {
  handleRegisterClient,
  handleVerifyClient,
  handleGenerateNewOTP,
} = require("../Controllers/Auth_Controllers/RegisterControllers/RegisterClientCtrl");
const {
  handleLogin,
} = require("../Controllers/Auth_Controllers/LoginController");
const {
  handleForgotPassword,
  handleResetPassword,
} = require("../Controllers/Auth_Controllers/RetrievePasswordController");
const {
  handleRegisterAdmin,
} = require("../Controllers/Auth_Controllers/RegisterControllers/RegisterAdminCtrl");
const {
  handleRegisterDriver,
} = require("../Controllers/Auth_Controllers/RegisterControllers/RegisterDriverCtrl");
const { handleAddVehicle } = require("../Controllers/AddVehicleCtrl");

const AuthRouter = express.Router();

AuthRouter.post("/register-client", Verification, handleRegisterClient);

AuthRouter.post("/verify-client", AuthenticateClient, handleVerifyClient);

AuthRouter.post("/login", handleLogin);

AuthRouter.post("/add-vehicle", AuthenticateClient, handleAddVehicle);

AuthRouter.post(
  "/register-admin",
  AuthenticateClient,
  Verification,
  handleRegisterAdmin
);

AuthRouter.post(
  "/register-driver",
  AuthenticateClient,
  Verification,
  handleRegisterDriver
);

AuthRouter.patch("/generate-new-otp", AuthenticateClient, handleGenerateNewOTP);

AuthRouter.post("/forgot-Password", handleForgotPassword);

AuthRouter.post("/reset-Password", handleResetPassword);

module.exports = AuthRouter;
