const mongoose = require('mongoose');

const CandidateOTPVerificationSchema = new mongoose.Schema({
    otp: String,
    userId: String,
    createdAt: Date,
    expiresAt: Date,
});

const CandidateOTPVerification = mongoose.model("CandidateOTPVerification", CandidateOTPVerificationSchema);

module.exports = CandidateOTPVerification;