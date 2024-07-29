const express = require('express');
const mongoose = require('mongoose');
const CandidatePortfolio = require('../models/candidatePortfolioSchema');
const Candidate = require('../models/candidateSchema'); 

const router = express.Router();

router.post('/candidate/setProjects/:candidateId/', async (req, res) => {
    const { candidateId } = req.params;
    const projectsArray = req.body.projects;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).send({ error: 'Invalid candidate ID' });
    }

    try {
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).send({ error: 'Candidate not found' });
        }

        let portfolio = await CandidatePortfolio.findOne({ candidateId: candidateId });

        if (portfolio) {
            projectsArray.forEach(project => {
                portfolio.projects.push(project);
            });
            await portfolio.save();
            res.status(200).json({ message: 'Projects updated successfully', data: portfolio });
        } else {
            portfolio = new CandidatePortfolio({
                candidateId,
                projects: projectsArray
            });
            await portfolio.save();
            res.status(201).json({ message: 'Projects added successfully', data: portfolio });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/candidate/getProjects/:candidateId', async (req, res) => {
    const { candidateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).send({ error: 'Invalid candidate ID' });
    }

    try {
        const projects = await CandidatePortfolio.find({ candidateId: candidateId });
        if (!projects || projects.length === 0) {
            return res.status(404).send({ error: 'No projects found for this candidate' });
        }
        res.status(200).json({ message: 'Projects retrieved successfully', data: projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).send({ error: error.message });
    }
});
router.delete('/candidate/deleteProject/:candidateId/:projectId', async (req, res) => {
    const { candidateId, projectId } = req.params;

    // Validate candidateId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).send({ error: 'Invalid candidate ID' });
    }

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).send({ error: 'Invalid project ID' });
    }

    try {
        // Retrieve the candidate's portfolio
        const portfolio = await CandidatePortfolio.findOne({ candidateId: candidateId });
        if (!portfolio) {
            return res.status(404).send({ error: 'Candidate portfolio not found' });
        }

        // Find the project to be deleted in the portfolio
        const projectIndex = portfolio.projects.findIndex(project => project._id.equals(projectId));
        if (projectIndex === -1) {
            return res.status(404).send({ error: 'Project not found in portfolio' });
        }

        // Remove the project from the portfolio
        portfolio.projects.splice(projectIndex, 1);

        // Save the updated portfolio document
        await portfolio.save();

        // Respond with success message
        res.status(200).json({ message: 'Project deleted successfully', data: portfolio });
    } catch (error) {
        console.error("Error processing delete project request:", error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
