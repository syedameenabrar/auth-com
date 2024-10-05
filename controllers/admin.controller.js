const adminService = require("../services/admin.services");
const { logger, responser } = require("database-connection-function-com")

module.exports.adminRegister = async (req, res) => {
    logger.info("Creating The Register");
    const reqData = req.body;
    const data = await adminService.adminRegister(reqData);
    logger.data("successfully register created", data);
    return responser.send(200, "successFully admin Registed", req, res, data);
};

module.exports.adminLogin = async (req, res) => {
    logger.info("Creating The Login");
    const reqData = req.body;
    const data = await adminService.adminLogin(reqData);
    logger.data(data);
    return responser.send(200, "successfully admin login", req, res, data);
};

module.exports.adminRefreshOtp = async (req, res) => {
    logger.info("Refresh Otp");
    const reqData = req.body;
    const data = await adminService.refreshOtp(reqData);
    logger.data(data);
    return responser.send(200, "successfully refresh otp sent admin", req, res, data);
};
