const express = require('express');
const router = express.Router();
const { applyJob, getMyApplications, getJobApplications, updateStatus } = require('../controllers/application.controller');
const { protect, hrOnly } = require('../middleware/auth.middleware');

router.post('/', protect, applyJob);
router.get('/mine', protect, getMyApplications);
router.get('/job/:jobId', protect, hrOnly, getJobApplications);
router.put('/:id/status', protect, hrOnly, updateStatus);

module.exports = router;