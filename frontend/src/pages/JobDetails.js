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

  useEffect(() => {
    API.get(`/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (!resume) { setMessage('Please select a resume!'); return; }
    try {
      const formData = new FormData();
      formData.append('file', resume);
      const uploadRes = await API.post('/upload/resume', formData);
      await API.post('/applications', { jobId: id, resumeUrl: uploadRes.data.url });
      setMessage('Applied successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error applying');
    }
  };

  if (!job) return <div style={{background:'#1e1e2e', minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', color:'white'}}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.logo}>ATS Portal</h2>
        <button style={styles.btnOutline} onClick={() => navigate('/')}>Back to Jobs</button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <h2 style={styles.jobTitle}>{job.title}</h2>
            <span style={styles.badge}>{job.branch?.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoItem}>Department: {job.department}</span>
            <span style={styles.infoItem}>Seats: {job.seats}</span>
          </div>
          <p style={styles.description}>{job.description}</p>

          {/* Apply Section */}
          {user?.role === 'candidate' && (
            <div style={styles.applySection}>
              <h3 style={styles.applyTitle}>Apply for this Position</h3>
              <input
                type="file"
                accept=".pdf"
                onChange={e => setResume(e.target.files[0])}
                style={styles.fileInput}
              />
              <button style={styles.applyBtn} onClick={handleApply}>Submit Application</button>
              {message && (
                <p style={{
                  ...styles.message,
                  color: message.includes('success') ? '#4ade80' : '#f87171'
                }}>{message}</p>
              )}
            </div>
          )}

          {!user && (
            <div style={styles.applySection}>
              <p style={styles.loginMsg}>Please <span style={styles.linkColor} onClick={() => navigate('/login')}>login</span> to apply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#1e1e2e',
    color: '#e2e8f0',
  },
  header: {
    background: '#252538',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #3a3a52',
  },
  logo: {
    color: '#818cf8',
    margin: 0,
    fontSize: '26px',
  },
  btnOutline: {
    background: 'transparent',
    color: '#a5b4fc',
    border: '1px solid #4a4a6a',
    padding: '9px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  content: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  card: {
    background: '#252538',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid #3a3a52',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  jobTitle: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
  },
  badge: {
    background: '#2e2e50',
    color: '#818cf8',
    padding: '4px 12px',
    borderRadius: '99px',
    fontSize: '14px',
    border: '1px solid #6366f1',
  },
  infoRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
  },
  infoItem: {
    color: '#94a3b8',
    fontSize: '16px',
  },
  description: {
    color: '#cbd5e1',
    fontSize: '17px',
    lineHeight: '1.7',
    marginBottom: '28px',
    borderTop: '1px solid #3a3a52',
    paddingTop: '20px',
  },
  applySection: {
    background: '#1e1e2e',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #3a3a52',
  },
  applyTitle: {
    color: '#ffffff',
    fontSize: '20px',
    marginBottom: '16px',
  },
  fileInput: {
    display: 'block',
    marginBottom: '16px',
    color: '#a5b4fc',
    fontSize: '16px',
  },
  applyBtn: {
    padding: '11px 28px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  message: {
    marginTop: '12px',
    fontSize: '16px',
  },
  loginMsg: {
    color: '#94a3b8',
    fontSize: '16px',
  },
  linkColor: {
    color: '#818cf8',
    cursor: 'pointer',
  },
};

export default JobDetails;