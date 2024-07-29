const mongoose = require("mongoose");

const employerProfileSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  companyName: { type: String, required: true },
  industry: String,
  profession: String,
  address: String,
  contact: String,
  companyDescription: String,
  websiteURL: String,
  facebookURL: String,
  instagramURL: String,
  twitterURL: String,
  profilePictureUrl: String,
});

module.exports = mongoose.model("EmployerProfile", employerProfileSchema);