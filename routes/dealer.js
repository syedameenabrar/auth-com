const express = require("express");
const dealerRouter = express.Router();
const dealerController = require("../controllers/dealer.controller");
// const { catchError } = require("common-function-api")
const { catchError } = require("../utils/catchError")

dealerRouter.route("/register").post(catchError(dealerController.dealerRegister));
dealerRouter.route("/login").post(catchError(dealerController.dealerLogin));
dealerRouter.route("/refresh-otp").post(catchError(dealerController.dealerRefreshOtp));

module.exports = dealerRouter;
