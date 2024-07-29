const mongoose = require("mongoose");

const EmployerPasswordResetSchema = new mongoose.Schema({
  userId: String,
  createdAt: Date,
  expiresAt: Date,
  resetString: String,
});

const EmployerPasswordReset = mongoose.model(
  "EmployerPasswordReset",
  EmployerPasswordResetSchema,
);

module.exports = EmployerPasswordReset;