const express = require("express");

const AuthenticateClient = require("../MiddleWare/AuthentificateClient");
const { handleAddVehicle } = require("../Controllers/AddVehicleCtrl");
const {
  handleAddClientBudget,
} = require("../Controllers/CostMaintenace_Controllers/AddClientBudgetCtrl");

const Router = express.Router();

Router.post("/add-client-budget", AuthenticateClient, handleAddClientBudget);

Router.post("/add-vehicle", AuthenticateClient, handleAddVehicle);

module.exports = Router;
