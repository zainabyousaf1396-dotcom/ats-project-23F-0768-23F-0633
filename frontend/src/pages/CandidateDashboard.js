import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CandidateDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    API.get('/applications/mine').then(res => setApplications(res.data));
  }, []);

  const statusColor = (status) => {
    if (status === 'Shortlisted' || status === 'Selected') return '#4ade80';
    if (status === 'Rejected') return '#f87171';
    if (status === 'Interview Scheduled') return '#fbbf24';
    return '#818cf8';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.logo}>ATS Portal</h2>
        <div style={styles.navLinks}>
          <span style={styles.welcome}>{user?.name}</span>
          <button style={styles.btnPrimary} onClick={() => navigate('/')}>Browse Jobs</button>
          <button style={styles.btnOutline} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.pageTitle}>My Applications</h2>
        <p style={styles.pageSubtitle}>Track all your job applications here</p>

        {applications.length === 0 && (
          <div style={styles.empty}>
            <p>No applications yet.</p>
            <button style={styles.btnPrimary} onClick={() => navigate('/')}>Browse Jobs</button>
          </div>
        )}

        <div style={styles.grid}>
          {applications.map(app => (
            <div key={app._id} style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.jobTitle}>{app.job?.title}</h3>
                <span style={{...styles.badge, color: statusColor(app.status), borderColor: statusColor(app.status)}}>
                  {app.status}
                </span>
              </div>
              <p style={styles.jobInfo}>{app.job?.department}</p>
              <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                <button style={styles.resumeBtn}>View Resume</button>
              </a>
            </div>
          ))}
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
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  welcome: {
    color: '#a5b4fc',
    fontSize: '22px',
  },
  btnPrimary: {
    background: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '9px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
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
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '0 20px',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  pageSubtitle: {
    color: '#64748b',
    fontSize: '16px',
    marginBottom: '28px',
  },
  empty: {
    background: '#252538',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#64748b',
    border: '1px solid #3a3a52',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#252538',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #3a3a52',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  jobTitle: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '13px',
    border: '1px solid',
    whiteSpace: 'nowrap',
    background: 'transparent',
  },
  jobInfo: {
    color: '#64748b',
    fontSize: '15px',
    marginBottom: '16px',
  },
  resumeBtn: {
    padding: '8px 18px',
    background: 'transparent',
    color: '#818cf8',
    border: '1px solid #6366f1',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },
};

export default CandidateDashboard;