import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [jobs, setJobs] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/jobs').then(res => setJobs(res.data));
  }, []);

  return (
    <div>
      <h1>ATS Portal</h1>
      {user ? (
        <div>
          <span>Hi, {user.name}</span>
          <button onClick={() => navigate(user.role === 'hr' ? '/hr' : '/candidate')}>Dashboard</button>
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </div>
      )}

      <h2>Available Jobs</h2>
      {jobs.length === 0 && <p>No jobs yet.</p>}
      {jobs.map(job => (
        <div key={job._id} style={{border:'1px solid #ccc', padding:'10px', margin:'10px'}}>
          <h3>{job.title}</h3>
          <p>Department: {job.department}</p>
          <p>Branch: {job.branch?.name}</p>
          <p>Seats: {job.seats}</p>
          <button onClick={() => navigate(`/jobs/${job._id}`)}>View & Apply</button>
        </div>
      ))}
    </div>
  );
}

export default Home;