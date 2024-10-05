const { logger, AppError, } = require("database-connection-function-com")
const bcrypt = require("bcryptjs");

// custom packages
const adminModel = require("../models/admin.model");
const tokenService = require("../middlewares/token");
const { generateOTP, generateUniqueUsername } = require('../utils/utils');
const sms = require('./sms/fast2sms');

// register admin
module.exports.adminRegister = async (body) => {
    logger.info("admin registration started");
    if (!body.email) throw new AppError(404, "Email Required");
    if (!body.phoneNumber) throw new AppError(404, "Phone Number Required");
    if (!body.password) throw new AppError(404, "Password Required");

    const isEmailExist = await adminModel.findOne({ email: body.email });
    if (isEmailExist) throw new AppError(429, "Email already exists");

    const isPhoneExist = await adminModel.findOne({ phoneNumber: body.phoneNumber });
    if (isPhoneExist) throw new AppError(429, "Phone number already exists");

    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const payload = {
        username: generateUniqueUsername('ADMIN'),
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        isAdmin: true,
        phoneOTP: generateOTP(),
    };
    logger.info(payload);
    const adminCreation = await adminModel.create(payload);
    const admin = await adminModel.findOne({ _id: adminCreation._id }).select("-password -__v")
    await sms.smsOTPV2(admin);
    admin.phoneOTP = undefined;
    return admin
};

module.exports.adminLogin = async (body) => {
    logger.info(`Login service started`);

    // Check if the login is with email/phone and password OR phoneNumber and OTP
    if (!(body.email || body.phoneNumber)) {
        throw new AppError(400, 'Email or Phone Number is required');
    }

    if (!(body.password || body.phoneOTP)) {
        throw new AppError(400, 'Password or OTP is required');
    }

    let filter = {};

    // Build filter based on email or phoneNumber
    if (body.email) {
        filter.email = body.email;
    } else if (body.phoneNumber) {
        filter.phoneNumber = body.phoneNumber;
    }

    // Find user by email or phoneNumber
    const admin = await adminModel.findOne(filter);
    if (!admin) {
        throw new AppError(404, 'admin does not exist');
    }

    // If login is via password
    if (body.password) {
        const isPasswordValid = bcrypt.compareSync(body.password, admin.password);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials');
        }
    }

    // If login is via OTP
    if (body.phoneOTP) {
        if (body.phoneOTP !== String(admin.phoneOTP)) {
            throw new AppError(401, 'Invalid OTP');
        }
        // If OTP is valid, mark phone as verified and reset OTP
        await adminModel.findOneAndUpdate(
            { _id: admin._id },
            { phoneOTP: null, }
        );
    }

    // Generate tokens
    const accessToken = tokenService.signToken(admin._id, 'access');
    const refreshToken = tokenService.signToken(admin._id, 'refresh');

    const record = {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        accountType: admin.accountType,
        accessToken,
        refreshToken,
    };

    return record;
};

module.exports.refreshOtp = async (body) => {
    logger.info("Refresh service Starting");
    const filter = { phoneNumber: body.phoneNumber };
    const admin = await adminModel.findOne(filter);
    if (!admin) {
        throw new AppError(404, "Your not a existing admin.Register first!");
    }
    const record = await adminModel.findOneAndUpdate(
        { _id: admin.id },
        { phoneOTP: generateOTP() }
    );
    await sms.smsOTPV2(record);
    logger.info(record);
    record.phoneOTP = undefined;
    return record;
};