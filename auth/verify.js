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
        if (!token) {
            logger.warn("No token provided in Authorization header");
            throw new AppError(401, "Unauthorized request");
        }

        logger.info(`Token received: ${token}`);
        const decodedToken = jwt.verify(token, config.JWT_SECRET);

        logger.info(`Decoded token: ${JSON.stringify(decodedToken)}`);

        // Check if the decoded ID exists in the user collection
        const userPromise = userService.findOneRecord(decodedToken?._id);
        // Check if the decoded ID exists in the admin collection
        const adminPromise = adminModel.findOne({ _id: decodedToken?._id });

        const [user, admin] = await Promise.all([userPromise, adminPromise]);

        if (user) {
            logger.info(`User found: ${JSON.stringify(user)}`);
            req.user = user;
            req.userId = user._id;
        }

        if (admin) {
            logger.info(`Admin found: ${JSON.stringify(admin)}`);
            req.admin = admin;
            req.userId = admin._id; // Using userId for uniformity
        }

        // If neither user nor admin is found, throw an error
        if (!user && !admin) {
            logger.warn("No user or admin found for token");
            throw new AppError(401, "Invalid Access Token");
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        logger.error("JWT Verification Failed:", error);
        throw new AppError(401, error?.message || "Invalid access token");
    }
});
