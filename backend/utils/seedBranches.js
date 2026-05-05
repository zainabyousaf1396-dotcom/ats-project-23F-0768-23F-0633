require('dotenv').config();
const mongoose = require('mongoose');
const Branch = require('../models/Branch');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Branch.insertMany([
    { name: 'Islamabad', location: 'Islamabad' },
    { name: 'Lahore', location: 'Lahore' },
    { name: 'Karachi', location: 'Karachi' },
    { name: 'Remote', location: 'Remote' },
  ]);
  console.log('Branches added!');
  process.exit();
});