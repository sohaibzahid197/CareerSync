const express = require("express");
const router = express.Router();

const BookmarkedCandidate = require("../models/BookmarkedCandidateSchema");
const CandidateProfile = require("../models/candidateProfile");

router.post("/employer/bookmarks/add", async (req, res) => {
  try {
    const { employerId, candidateId, resumeId } = req.body;

    let bookmarkedCandidate = await BookmarkedCandidate.findOne({ employerId });

    if (!bookmarkedCandidate) {
      bookmarkedCandidate = new BookmarkedCandidate({
        employerId,
        bookmarks: [],
      });
    }

    const existingBookmarkIndex = bookmarkedCandidate.bookmarks.findIndex(
        (bookmark) => bookmark.candidateId.toString() === candidateId
    );

    if (existingBookmarkIndex !== -1) {
      bookmarkedCandidate.bookmarks[existingBookmarkIndex] = {
        candidateId,
        resumeId,
        isBookmarked: true,
      };
    } else {
      bookmarkedCandidate.bookmarks.push({
        candidateId,
        resumeId,
        isBookmarked: true,
      });
    }

    await bookmarkedCandidate.save();

    res.status(201).json({ message: "Bookmark added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/employer/bookmarks/remove", async (req, res) => {
  try {
    const { employerId, candidateId } = req.body;

    let bookmarkedCandidate = await BookmarkedCandidate.findOne({ employerId });

    if (!bookmarkedCandidate) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    const existingBookmarkIndex = bookmarkedCandidate.bookmarks.findIndex(
        (bookmark) => bookmark.candidateId.toString() === candidateId
    );

    if (existingBookmarkIndex === -1) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    bookmarkedCandidate.bookmarks.splice(existingBookmarkIndex, 1);

    await bookmarkedCandidate.save();

    await CandidateProfile.findOneAndUpdate(
        { candidateId },
        { bookmarked: false }
    );

    res.json({ message: "Bookmark removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;