const express = require('express');
const { initiateZoomMeeting, getZoomOAuthTokens, createZoomMeeting } = require('../zoomIntegration/zoomApi');

const router = express.Router();
let candidate_email;
let employer_email;

router.get('/api/zoom/meeting/', async (req, res) => {
  try {
    const { candidateEmail, employerEmail } = req.query;
    candidate_email = candidateEmail;
    employer_email = employerEmail;
    const {authUrl} = await initiateZoomMeeting();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating Zoom meeting' });
  }
});

router.get('/api/zoom/auth/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokens = await getZoomOAuthTokens(code);
    const meetingUrl = await createZoomMeeting(tokens.access_token, 'Meeting Topic');
    res.json({ meetingUrl, candidate_email, employer_email });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Zoom meeting' });
  }
});

module.exports = router;
