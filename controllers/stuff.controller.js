const staffService = require("../services/staff.services");
const { logger, responser } = require("database-connection-function-com")

module.exports.staffRegister = async (req, res) => {
    logger.info("Creating The Register");
    const reqData = req.body;
    const data = await staffService.staffRegister(reqData);
    logger.data("successfully register created", data);
    return responser.send(200, "successFully staff Registed", req, res, data);
};

module.exports.staffLogin = async (req, res) => {
    logger.info("Creating The Login");
    const reqData = req.body;
    const data = await staffService.staffLogin(reqData);
    logger.data(data);
    return responser.send(200, "successfully staff login", req, res, data);
};

module.exports.staffRefreshOtp = async (req, res) => {
    logger.info("Refresh Otp");
    const reqData = req.body;
    const data = await staffService.refreshOtp(reqData);
    logger.data(data);
    return responser.send(200, "successfully refresh otp sent staff", req, res, data);
};
