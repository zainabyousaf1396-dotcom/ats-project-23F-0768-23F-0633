const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
  origin: 'https://ats-project-23-f-0768-23-f-0633-ten.vercel.app'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ATS Backend is running!' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/applications', require('./routes/application.routes'));
app.use('/api/branches', require('./routes/branch.routes'));
app.use('/api/upload', require('./routes/upload.routes'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});