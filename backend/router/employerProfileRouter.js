const express = require("express");
const router = express.Router();
const EmployerProfile = require("../models/EmployerProfile");

router.post("/employer-profile", async (req, res) => {
  try {
    const {
      employerId,
      companyName,
      industry,
      address,
      contact,
      profession,
      companyDescription,
      websiteURL,
      facebookURL,
      instagramURL,
      twitterURL,
      profilePicture,
    } = req.body;

    const profileData = {
      employerId,
      companyName,
      industry,
      address,
      contact,
      profession,
      companyDescription,
      websiteURL,
      facebookURL,
      instagramURL,
      twitterURL,
      profilePictureUrl: profilePicture,
    };
    Object.keys(profileData).forEach(
      (key) => profileData[key] === undefined && delete profileData[key]
    );
    const profile = new EmployerProfile(profileData);
    await profile.save();

    res.status(201).json({ message: "Profile saved successfully", profile });
  } catch (error) {
    console.error("Saving error:", error);
    res
      .status(400)
      .json({ error: "Error saving profile", error: error.message });
  }
});

module.exports = router;