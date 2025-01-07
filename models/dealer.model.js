const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const dealerSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        fullName: { type: String },
        email: { type: String, required: true, unique: true },
        emailOtp: { type: Number, },
        phoneNumber: { type: Number, required: true, unique: true },
        phoneOTP: { type: Number, },
        password: { type: String },
        accountType: {
            type: String,
            default: "dealer",
        },
        isDealer: { type: Boolean, required: true },
        profilePicture: { type: String },
        collectionName: {
            type: String,
            default: "dealer",
        },
    },
    {
        timestamps: true,
    }
);

dealerSchema.plugin(paginate);
dealerSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("dealer", dealerSchema);
