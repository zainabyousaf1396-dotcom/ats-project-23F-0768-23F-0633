const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { protect, hrOnly } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

router.post('/', protect, hrOnly, async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json(branch);
});

module.exports = router;