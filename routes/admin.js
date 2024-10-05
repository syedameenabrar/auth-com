const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/admin.controller");
// const { catchError } = require("common-function-api")
const { catchError } = require("../utils/catchError")

adminRouter.route("/register").post(catchError(adminController.adminRegister));
adminRouter.route("/login").post(catchError(adminController.adminLogin));
adminRouter.route("/refresh-otp").post(catchError(adminController.adminRefreshOtp));

module.exports = adminRouter;
