const Application = require('../models/Application');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to, subject, text
  });
};

exports.applyJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetterUrl } = req.body;
    const existing = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied' });
    const app = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resumeUrl,
      coverLetterUrl
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user.id }).populate('job');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId }).populate('candidate', '-password');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('candidate');

    const candidate = app.candidate;
    let emailText = '';

    if (status === 'Shortlisted') {
      emailText = `Dear ${candidate.name}, Congratulations! You have been shortlisted for the position.`;
    } else if (status === 'Rejected') {
      emailText = `Dear ${candidate.name}, We regret to inform you that your application has been rejected.`;
    } else if (status === 'Interview Scheduled') {
      emailText = `Dear ${candidate.name}, Your interview has been scheduled. Please check the portal for details.`;
    }

    if (emailText) {
      await sendEmail(candidate.email, `Application Status: ${status}`, emailText);
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};