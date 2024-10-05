const dealerService = require("../services/dealer.services");
const { logger, responser } = require("database-connection-function-com")

module.exports.dealerRegister = async (req, res) => {
    logger.info("Creating The Register");
    const reqData = req.body;
    const data = await dealerService.dealerRegister(reqData);
    logger.data("successfully register created", data);
    return responser.send(200, "successFully dealer Registed", req, res, data);
};

module.exports.dealerLogin = async (req, res) => {
    logger.info("Creating The Login");
    const reqData = req.body;
    const data = await dealerService.dealerLogin(reqData);
    logger.data(data);
    return responser.send(200, "successfully dealer login", req, res, data);
};

module.exports.dealerRefreshOtp = async (req, res) => {
    logger.info("Refresh Otp");
    const reqData = req.body;
    const data = await dealerService.refreshOtp(reqData);
    logger.data(data);
    return responser.send(200, "successfully refresh otp sent dealer", req, res, data);
};
