import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  // Mere applications lao
  useEffect(() => {
    API.get('/applications/mine').then(res => setApplications(res.data));
  }, []);

  return (
    <div style={{padding:'20px'}}>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={() => navigate('/')}>Browse Jobs</button>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>

      <h3>My Applications</h3>
      {applications.length === 0 && <p>No applications yet.</p>}
      {applications.map(app => (
        <div key={app._id} style={{border:'1px solid #ccc', padding:'10px', margin:'10px'}}>
          <h4>{app.job?.title}</h4>
          <p>Department: {app.job?.department}</p>
          <p>Status: <strong>{app.status}</strong></p>
          <a href={app.resumeUrl} target="_blank" rel="noreferrer">View Resume</a>
        </div>
      ))}
    </div>
  );
}

export default CandidateDashboard;