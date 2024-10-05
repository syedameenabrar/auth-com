const express = require("express");
const staffRouter = express.Router();
const staffController = require("../controllers/staff.controller");
// const { catchError } = require("common-function-api")
const { catchError } = require("../utils/catchError")

staffRouter.route("/register").post(catchError(staffController.staffRegister));
staffRouter.route("/login").post(catchError(staffController.staffLogin));
staffRouter.route("/refresh-otp").post(catchError(staffController.staffRefreshOtp));

module.exports = staffRouter;
