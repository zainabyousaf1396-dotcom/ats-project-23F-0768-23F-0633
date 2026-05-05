import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function HRDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '', description: '', department: '', seats: '', branch: ''
  });

  useEffect(() => {
    API.get('/jobs').then(res => setJobs(res.data));
    API.get('/branches').then(res => setBranches(res.data));
  }, []);

  const viewApplicants = async (jobId) => {
    const res = await API.get(`/applications/job/${jobId}`);
    setApplications(res.data);
  };

  const updateStatus = async (appId, status) => {
    await API.put(`/applications/${appId}/status`, { status });
    alert('Status updated!');
  };

  const createJob = async () => {
    await API.post('/jobs', newJob);
    alert('Job created!');
    const res = await API.get('/jobs');
    setJobs(res.data);
  };

  return (
    <div>
      <h2>HR Dashboard</h2>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>

      <h3>Create Job</h3>
      <input placeholder="Title" onChange={e => setNewJob({...newJob, title: e.target.value})} />
      <input placeholder="Department" onChange={e => setNewJob({...newJob, department: e.target.value})} />
      <input placeholder="Description" onChange={e => setNewJob({...newJob, description: e.target.value})} />
      <input placeholder="Seats" type="number" onChange={e => setNewJob({...newJob, seats: e.target.value})} />
      <select onChange={e => setNewJob({...newJob, branch: e.target.value})}>
        <option value="">Select Branch</option>
        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
      </select>
      <button onClick={createJob}>Create Job</button>

      <h3>All Jobs</h3>
      {jobs.map(job => (
        <div key={job._id} style={{border:'1px solid #ccc', padding:'10px', margin:'10px'}}>
          <h4>{job.title}</h4>
          <p>{job.department} | Seats: {job.seats}</p>
          <button onClick={() => viewApplicants(job._id)}>View Applicants</button>
        </div>
      ))}

      <h3>Applicants</h3>
      {applications.length === 0 && <p>No applicants.</p>}
      {applications.map(app => (
        <div key={app._id} style={{border:'1px solid #ccc', padding:'10px', margin:'10px'}}>
          <p>Name: {app.candidate?.name}</p>
          <p>Email: {app.candidate?.email}</p>
          <p>Status: {app.status}</p>
          <a href={app.resumeUrl} target="_blank" rel="noreferrer">View Resume</a><br/><br/>
          <button onClick={() => updateStatus(app._id, 'Shortlisted')}>Shortlist</button>
          <button onClick={() => updateStatus(app._id, 'Rejected')}>Reject</button>
          <button onClick={() => updateStatus(app._id, 'Interview Scheduled')}>Interview</button>
        </div>
      ))}
    </div>
  );
}

export default HRDashboard;