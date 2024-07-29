const express = require("express");
const Resume = require("../models/resumeSchema");
const router = express.Router();

router.post("/candidate/uploadResume", async (req, res) => {
  try {
    const {
      candidateId,
      size,
      contentType,
      protectedUrl,
    } = req.body;
    if (!candidateId) {
      return res.status(400).json({ error: "userId is required" });
    }
    if (!protectedUrl) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }
    const resume = {
        size,
        candidateId,
        contentType,
        protectedUrl,
    }
    Object.keys(resume).forEach(key => resume[key] === undefined && delete resume[key]);

    const newResume = new Resume(resume);
console.log(newResume);
console.log(newResume);
    await newResume.save();
    return res.json({ message: "Resume Uploaded Successfully"});
  } catch (error) {
    console.error("Error Uploading Resume:", error);
    res.status(500).json({ error: "Resume Upload Failed" });
  }
});

router.get("/candidate/getResume/:candidateId", async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const resume = await Resume.findOne({ candidateId });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found for the candidate ID provided" });
    }

    return res.json({ resumeUrl: resume.protectedUrl });
  } catch (error) {
    console.error("Error retrieving resume:", error);
    res.status(500).json({ error: "Failed to retrieve resume" });
  }
});
module.exports = router;