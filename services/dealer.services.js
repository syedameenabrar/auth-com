const { logger, AppError, } = require("database-connection-function-com")
const bcrypt = require("bcryptjs");

// custom packages
const dealerModel = require("../models/dealer.model");
const tokenService = require("../middlewares/token");
const { generateOTP, generateUniqueUsername } = require('../utils/utils');
const sms = require('./sms/fast2sms');

// register dealer
module.exports.dealerRegister = async (body) => {
    logger.info("Dealer registration started");
    if (!body.email) throw new AppError(404, "Email Required");
    if (!body.phoneNumber) throw new AppError(404, "Phone Number Required");
    if (!body.password) throw new AppError(404, "Password Required");

    const isEmailExist = await dealerModel.findOne({ email: body.email });
    if (isEmailExist) throw new AppError(429, "Email already exists");

    const isPhoneExist = await dealerModel.findOne({ phoneNumber: body.phoneNumber });
    if (isPhoneExist) throw new AppError(429, "Phone number already exists");

    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const payload = {
        username: generateUniqueUsername('DEALER'),
        fullName: body.fullName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        isDealer: true,
        phoneOTP: generateOTP(),
    };
    logger.info(payload);
    const delareCreation = await dealerModel.create(payload);
    const dealer = await dealerModel.findOne({ _id: delareCreation._id }).select("-password -__v")
    await sms.smsOTPV2(dealer);
    dealer.phoneOTP = undefined;
    return dealer
};

module.exports.dealerLogin = async (body) => {
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
    const dealer = await dealerModel.findOne(filter);
    if (!dealer) {
        throw new AppError(404, 'Dealer does not exist');
    }

    // If login is via password
    if (body.password) {
        const isPasswordValid = bcrypt.compareSync(body.password, dealer.password);
        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials');
        }
    }

    // If login is via OTP
    if (body.phoneOTP) {
        if (body.phoneOTP !== String(dealer.phoneOTP)) {
            throw new AppError(401, 'Invalid OTP');
        }
        // If OTP is valid, mark phone as verified and reset OTP
        await dealerModel.findOneAndUpdate(
            { _id: dealer._id },
            // { phoneOTP: null, },
           { $unset: { phoneOTP: "" }}
        );
    }

    // Generate tokens
    const accessToken = tokenService.signToken(dealer._id, 'access');
    const refreshToken = tokenService.signToken(dealer._id, 'refresh');

    const record = {
        _id: dealer._id,
        username: dealer.username,
        email: dealer.email,
        fullName: dealer.fullName,
        accountType: dealer.accountType,
        accessToken,
        refreshToken,
    };

    return record;
};

module.exports.refreshOtp = async (body) => {
    logger.info("Refresh service Starting");
    const filter = { phoneNumber: body.phoneNumber };
    const dealer = await dealerModel.findOne(filter);
    if (!dealer) {
        throw new AppError(404, "Your not a existing dealer.Register first!");
    }const option = { new: true };
    const record = await dealerModel.findOneAndUpdate(
        { _id: dealer._id },
        { phoneOTP: generateOTP() },
        option
    );
    await sms.smsOTPV2(record);
    logger.info(record);
    record.phoneOTP = undefined;
    return record;
};