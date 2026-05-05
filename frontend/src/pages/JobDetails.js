import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

  // Job detail lata hai
  useEffect(() => {
    API.get(`/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (!resume) { setMessage('Please select a resume!'); return; }

    try {
      // Resume Cloudinary par upload karo
      const formData = new FormData();
      formData.append('file', resume);
      const uploadRes = await API.post('/upload/resume', formData);

      // Job ke liye apply karo
      await API.post('/applications', {
        jobId: id,
        resumeUrl: uploadRes.data.url
      });
      setMessage('Applied successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error applying');
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div style={{padding:'20px'}}>
      <button onClick={() => navigate('/')}>Back</button>
      <h2>{job.title}</h2>
      <p>Department: {job.department}</p>
      <p>Branch: {job.branch?.name}</p>
      <p>Seats: {job.seats}</p>
      <p>Description: {job.description}</p>

      {user?.role === 'candidate' && (
        <div>
          <h3>Apply Now</h3>
          <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])} />
          <button onClick={handleApply}>Submit Application</button>
          {message && <p>{message}</p>}
        </div>
      )}

      {!user && (
        <p>Please <a href="/login">login</a> to apply.</p>
      )}
    </div>
  );
}

export default JobDetails;