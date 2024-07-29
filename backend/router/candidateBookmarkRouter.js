const express = require("express");
const router = express.Router();

const BookmarkedJob = require("../models/bookmarkedJobSchema");
const Candidate = require("../models/candidateSchema");

router.post("/candidate/bookmarks/add", async (req, res) => {
  try {
    console.log("Abubakar", req.body);
    const {
      candidateId,
      job_id: jobId,
      employer_name: employerName,
      employer_logo: employerLogo,
      employer_website: employerWebsite,
      employer_company_type: employerCompanyType,
      job_publisher: jobPublisher,
      job_employment_type: jobEmploymentType,
      job_title: jobTitle,
      job_apply_link: jobApplyLink,
      job_apply_is_direct: jobApplyIsDirect,
      apply_options,
      job_description: jobDescription,
      job_is_remote: jobIsRemote,
      job_city: jobCity,
      job_state: jobState,
      job_country: jobCountry,
      job_requested_skills: jobRequestedSkills,
      job_required_education: jobRequiredEducation,
      job_salary_currency: jobSalaryCurrency,
      job_min_salary: jobMinSalary,
      job_max_salary: jobMaxSalary,
      job_highlights,
      responsibilities,
      isBookmarked,
    } = req.body;

    const candidateExists = await Candidate.findById(candidateId);
    if (!candidateExists) {
      return res.status(400).json({ error: "Candidate not found" });
    }

    if (isBookmarked) {
      // If the job is bookmarked, store it
      let bookmarkedJob = await BookmarkedJob.findOne({ candidateId });

      if (!bookmarkedJob) {
        bookmarkedJob = new BookmarkedJob({
          candidateId,
          bookmarkedJobs: [],
        });
      }

      const existingBookmarkIndex = bookmarkedJob.bookmarkedJobs.findIndex(
          (bookmark) => bookmark.job_id === jobId
      );

      const applyOptions =
          apply_options?.map((option) => ({
            publisher: option.publisher,
            apply_link: option.apply_link,
            is_direct: option.is_direct,
          })) ?? [];

      const newBookmark = {
        job_id: jobId,
        employer_name: employerName,
        employer_logo: employerLogo,
        employer_website: employerWebsite,
        employer_company_type: employerCompanyType,
        job_publisher: jobPublisher,
        job_employment_type: jobEmploymentType,
        job_title: jobTitle,
        job_apply_link: jobApplyLink,
        job_apply_is_direct: jobApplyIsDirect,
        apply_options: applyOptions,
        job_description: jobDescription,
        job_is_remote: jobIsRemote,
        job_city: jobCity,
        job_state: jobState,
        job_country: jobCountry,
        job_requested_skills: jobRequestedSkills,
        job_required_education: jobRequiredEducation,
        job_salary_currency: jobSalaryCurrency,
        job_min_salary: jobMinSalary,
        job_max_salary: jobMaxSalary,
        job_highlights,
        responsibilities,
        isBookmarked: true,
      };

      if (existingBookmarkIndex !== -1) {
        bookmarkedJob.bookmarkedJobs[existingBookmarkIndex] = newBookmark;
      } else {
        bookmarkedJob.bookmarkedJobs.push(newBookmark);
      }

      await bookmarkedJob.save();

      res.status(201).json({ message: "Bookmark added successfully" });
    } else {
      // If the job is not bookmarked, delete it
      await BookmarkedJob.findOneAndUpdate(
          { candidateId },
          { $pull: { bookmarkedJobs: { job_id: jobId } } }
      );

      res.status(200).json({ message: "Bookmark removed successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/candidate/bookmarks/remove", async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;

    const existingBookmark = await BookmarkedJob.findOneAndUpdate(
      { candidateId },
      { $pull: { bookmarkedJobs: { job_id: jobId } } },
      { new: true }
    );

    if (!existingBookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/candidate/bookmarks/:candidateId", async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const bookmarkedJobs = await BookmarkedJob.findOne({ candidateId });

    if (!bookmarkedJobs) {
      return res
        .status(404)
        .json({ error: "No bookmarked jobs found for the candidate" });
    }

    res.status(200).json(bookmarkedJobs.bookmarkedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;