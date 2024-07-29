
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    thumbnailUrl: String,
    projectName: String,
    projectType: String,
    projectDescription: String,
    repoUrl: String,
    liveUrl: String,
});

const candidatePortfolioSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    },
    projects: [projectSchema]
});

module.exports = mongoose.model("CandidatePortfolio", candidatePortfolioSchema, "candidateportfolios");
