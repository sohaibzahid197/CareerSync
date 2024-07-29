const mongoose = require("mongoose");

const CandidatePasswordResetSchema = new mongoose.Schema({
  userId: String,
  createdAt: Date,
  expiresAt: Date,
  resetString: String,
});

const CandidatePasswordReset = mongoose.model(
  "CandidatePasswordReset",
  CandidatePasswordResetSchema,
);

module.exports = CandidatePasswordReset;