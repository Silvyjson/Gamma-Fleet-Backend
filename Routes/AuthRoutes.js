const express = require("express");

const AuthenticateClient = require("../MiddleWare/AuthentificateClient");
const Verification = require("../MiddleWare/Verification");
const {
  handleRegisterClient,
  handleVerifyClient,
  handleGenerateNewOTP,
  handleGetClient,
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
  handleGetAllDriver,
  handleGetOneDriver,
} = require("../Controllers/Auth_Controllers/RegisterControllers/RegisterDriverCtrl");

const AuthRouter = express.Router();

AuthRouter.post("/register-client", Verification, handleRegisterClient);

AuthRouter.post("/verify-client", AuthenticateClient, handleVerifyClient);

AuthRouter.patch("/generate-new-otp", AuthenticateClient, handleGenerateNewOTP);

AuthRouter.get("/get-client", AuthenticateClient, handleGetClient);

AuthRouter.post("/login", handleLogin);

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

AuthRouter.get("/get-driver", AuthenticateClient, handleGetAllDriver);

AuthRouter.get("/get-driver/:id", AuthenticateClient, handleGetOneDriver);

AuthRouter.post("/forgot-Password", handleForgotPassword);

AuthRouter.post("/reset-Password", handleResetPassword);

module.exports = AuthRouter;
