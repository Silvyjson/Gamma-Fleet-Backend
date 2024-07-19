const express = require("express");

const AuthenticateClient = require("../MiddleWare/AuthentificateClient");
const Verification = require("../MiddleWare/Verification");
const {
  handleRegisterClient,
  handleVerifyClient,
  handleCompleteRegisterClient,
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

const AuthRouter = express.Router();

AuthRouter.post("/register-client", Verification, handleRegisterClient);

AuthRouter.get("/verify-client", handleVerifyClient);

AuthRouter.patch(
  "/complete-client-rigister",
  AuthenticateClient,
  handleCompleteRegisterClient
);

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

AuthRouter.post("/forgot-Password", handleForgotPassword);

AuthRouter.post("/reset-Password", handleResetPassword);

module.exports = AuthRouter;
