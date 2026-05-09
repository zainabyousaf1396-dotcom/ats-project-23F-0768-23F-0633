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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.logo}>ATS Portal</h2>
        <div style={styles.navLinks}>
          {user ? (
            <>
              <span style={styles.welcome}>{user.name}</span>
              <button style={styles.btnPrimary} onClick={() => navigate(user.role === 'hr' ? '/hr' : '/candidate')}>Dashboard</button>
              <button style={styles.btnOutline} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button style={styles.btnPrimary}>Login</button></Link>
              <Link to="/register"><button style={styles.btnOutline}>Register</button></Link>
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Next Opportunity</h1>
        <p style={styles.heroSub}>Browse open positions across all our branches in Pakistan</p>
      </div>

      {/* Jobs */}
      <div style={styles.content}>
        <h3 style={styles.sectionTitle}>Open Positions — {jobs.length} Available</h3>
        {jobs.length === 0 && (
          <div style={styles.empty}>No jobs available right now.</div>
        )}
        <div style={styles.grid}>
          {jobs.map(job => (
            <div key={job._id} style={styles.card}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}>
              <div style={styles.cardTop}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <span style={styles.badge}>{job.branch?.name}</span>
              </div>
              <p style={styles.jobInfo}>{job.department}</p>
              <p style={styles.jobSeats}>{job.seats} seats available</p>
              <button style={styles.applyBtn} onClick={() => navigate(`/jobs/${job._id}`)}>View & Apply</button>
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
    background: '#ffffff',
    color: '#1e1e2e',
  },
  header: {
    background: '#f9f9f9',
    padding: '16px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e0e0e0',
  },
  logo: {
    color: '#818cf8',
    margin: 0,
    fontSize: '26px',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  welcome: {
    color: '#6366f1',
    fontSize: '18px',
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
    color: '#6366f1',
    border: '1px solid #6366f1',
    padding: '9px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  hero: {
    padding: '40px 40px',
    textAlign: 'center',
    background: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '14px',
    letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '18px',
    color: '#666666',
  },
  content: {
    maxWidth: '1100px',
    margin: '40px auto',
    padding: '0 30px',
  },
  sectionTitle: {
    fontSize: '22px',
    color: '#000000',
    marginBottom: '30px',
    fontWeight: '400',
    letterSpacing: '0.5px',
  },
  empty: {
    background: '#f9f9f9',
    padding: '40px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#666666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#f9f9f9',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    transition: 'border-color 0.2s',
    cursor: 'default',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  jobTitle: {
    color: '#000000',
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  badge: {
    background: '#e8e8f0',
    color: '#6366f1',
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '13px',
    border: '1px solid #6366f1',
    whiteSpace: 'nowrap',
  },
  jobInfo: {
    color: '#666666',
    fontSize: '15px',
    marginBottom: '6px',
  },
  jobSeats: {
    color: '#666666',
    fontSize: '15px',
    marginBottom: '20px',
  },
  applyBtn: {
    width: '100%',
    padding: '10px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
};

export default Home;