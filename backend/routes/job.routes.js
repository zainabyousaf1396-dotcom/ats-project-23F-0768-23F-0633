const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/job.controller');
const { protect, hrOnly } = require('../middleware/auth.middleware');

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, hrOnly, createJob);
router.put('/:id', protect, hrOnly, updateJob);
router.delete('/:id', protect, hrOnly, deleteJob);

module.exports = router;