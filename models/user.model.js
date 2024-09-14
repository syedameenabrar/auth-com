const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        fullName: { type: String },
        email: { type: String, required: true, unique: true },
        emailOtp: { type: Number, },
        phoneNumber: { type: Number, required: true, unique: true },
        phoneOtp: { type: Number, },
        password: { type: String },
        accountType: {
            type: String,
            default: "user",
            enum: ["user", "admin", "dealer", "employee"],
        },
        profilePicture: { type: String },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(paginate);
userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("users", userSchema);
