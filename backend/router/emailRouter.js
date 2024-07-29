const express = require('express');
const nodemailer = require('nodemailer');
// const

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTHENTICATION_EMAIL,
    pass: process.env.AUTHENTICATION_PASSWORD,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: 'careersync.contact@gmail.com',
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

router.post('/send-email', async (req, res) => {
  const {
    candidateEmail,
    employerEmail,
    date,
    day,
      time,
    topic,
    meetingURL,
  } = req.body;
  console.log(candidateEmail, employerEmail, date, day, time, topic, meetingURL);

  try {
    await sendEmail(candidateEmail, 'CareerSync: Your Scheduled Interview Meeting', `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #007bff;
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 30px;
            text-align: justify;
          }
          .footer {
            background-color: #007bff;
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 8px 8px;
          }
          h2, h3 {
            color: #007bff;
          }
          ul {
            list-style-type: none;
            padding-left: 0;
          }
          li {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>CareerSync: Your Scheduled Interview Meeting</h2>
          </div>
          <div class="content">
            <p>Dear Candidate,</p>
            <p>We are delighted to confirm your upcoming online interview meeting with us. Your interest in joining our team is highly appreciated.</p>
            <p><strong>Interview Details:</strong></p>
            <p>Date: ${date}</p>
            <p>Day: ${day}</p>
            <p>Time: ${time}</p>
            <p>Topic: ${topic}</p>
            <p>Meeting URL: <a href="${meetingURL}" target="_blank">${meetingURL}</a></p>
            <p>Please ensure you are prepared for the interview and log in a few minutes before the scheduled start time. We look forward to discussing your qualifications and learning more about you.</p>
            <p>If you have any questions or need further information, please feel free to contact us.</p>
            <p>Warm regards,<br>The CareerSync Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CareerSync</p>
          </div>
        </div>
      </body>
      </html>
    `);

    await sendEmail(employerEmail, 'CareerSync: Candidate Interview Meeting Details', `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #007bff;
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 30px;
            text-align: justify;
          }
          .footer {
            background-color: #007bff;
            color: #fff;
            padding: 15px;
            text-align: center;
            border-radius: 0 0 8px 8px;
          }
          h2, h3 {
            color: #007bff;
          }
          ul {
            list-style-type: none;
            padding-left: 0;
          }
          li {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>CareerSync: Candidate Interview Meeting Details</h2>
          </div>
          <div class="content">
            <p>Dear Hiring Manager,</p>
            <p>We have scheduled an online interview with the following candidate:</p>
            <p><strong>Candidate Details:</strong></p>
            <p>Email: ${candidateEmail}</p>
            <p><strong>Interview Details:</strong></p>
            <p>Date: ${date}</p>
            <p>Day: ${day}</p>
            <p>Time: ${time}</p>
            <p>Topic: ${topic}</p>
            <p>Meeting URL: <a href="${meetingURL}" target="_blank">${meetingURL}</a></p>
            <p>Please be available and prepared for the interview. We appreciate your time and effort in the hiring process.</p>
            <p>If you have any questions or require further clarification, please do not hesitate to reach out.</p>
            <p>Best regards,<br>The CareerSync Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CareerSync</p>
          </div>
        </div>
      </body>
      </html>
    `);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

module.exports = router;
