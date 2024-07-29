const mongoose = require('mongoose');

const EmployerOTPVerificationSchema = new mongoose.Schema({
    otp: String,
    userId: String,
    createdAt: Date,
    expiresAt: Date,
});

const EmployerOTPVerification = mongoose.model("EmployerOTPVerification", EmployerOTPVerificationSchema);

module.exports = EmployerOTPVerification;