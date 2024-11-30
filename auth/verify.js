const jwt = require("jsonwebtoken");
const config = require("../config/index.js");
const userService = require("../services/user.services.js");
const adminModel = require("../models/admin.model.js");
const { logger, AppError, } = require("common-function-api")
// const { catchError } = require("common-function-api").catchError
const { catchError } = require("../utils/catchError.js")

// module.exports.verifyJWT = catchError(async (req, _, next) => {
//     logger.info(`Checking Jwt Middleware`);
//     try {
//         const token = req.header("Authorization")?.replace("Bearer ", "");
//         logger.data("Token", token);
//         if (!token) {
//             throw new AppError(401, "Unauthorized request");
//         }
//         const decodedToken = jwt.verify(token, config.JWT_SECRET);
//         const user = await userService.findOneRecord(decodedToken?._id);
//         const admin = await adminModel.findOne({ _id: decodedToken?._id })
//         if (!user) {
//             console.log("not foundjvjiejoihrehbwhwlbhlkj");
//             throw new AppError(401, "Invalid Access Token");
//         }

//         req.user = user;
//         req.userId = user._id;
//         next();
//     } catch (error) {
//         throw new AppError(401, error?.message || "Invalid access token");
//     }
// });


module.exports.verifyJWT = catchError(async (req, _, next) => {
    logger.info(`Checking Jwt Middleware`);

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        logger.data("Token", token);

        if (!token) {
            throw new AppError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, config.JWT_SECRET);

        // Check if the token corresponds to a user
        let user = await userService.findOneRecord(decodedToken?._id);
        if (user) {
            req.user = user;
            req.userId = user._id;
            return next();
        }

        // If not a user, check if the token corresponds to an admin
        let admin = await adminModel.findOne({ _id: decodedToken?._id });
        if (admin) {
            req.admin = admin;
            req.userId = admin._id; // Using userId for uniformity, but could use adminId if preferred
            return next();
        }

        // If neither user nor admin found, throw an error
        throw new AppError(401, "Invalid Access Token");
    } catch (error) {
        logger.error("JWT Verification Failed:", error);
        throw new AppError(401, error?.message || "Invalid access token");
    }
});