// Upload routes configuration
const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { protect } = require('../middleware/auth.middleware');

router.post('/resume', protect, upload.single('file'), (req, res) => {
  res.json({ url: req.file.path });
});

router.post('/coverletter', protect, upload.single('file'), (req, res) => {
  res.json({ url: req.file.path });
});

router.post('/photo', protect, upload.single('file'), (req, res) => {
  res.json({ url: req.file.path });
});

module.exports = router;