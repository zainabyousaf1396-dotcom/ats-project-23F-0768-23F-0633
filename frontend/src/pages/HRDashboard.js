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
  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '', description: '', department: '', seats: '', branch: ''
  });

  useEffect(() => {
    API.get('/jobs').then(res => setJobs(res.data));
    API.get('/branches').then(res => setBranches(res.data));
  }, []);

  const viewApplicants = async (job) => {
    setSelectedJob(job);
    const res = await API.get(`/applications/job/${job._id}`);
    setApplications(res.data);
  };

  const updateStatus = async (appId, status) => {
    await API.put(`/applications/${appId}/status`, { status });
    viewApplicants(selectedJob);
  };

  const createJob = async () => {
    if (!newJob.title || !newJob.branch) { alert('Title and Branch are required!'); return; }
    await API.post('/jobs', newJob);
    alert('Job created!');
    const res = await API.get('/jobs');
    setJobs(res.data);
    setNewJob({ title: '', description: '', department: '', seats: '', branch: '' });
  };

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
        <h2 style={styles.logo}>ATS Portal — HR</h2>
        <div style={styles.navLinks}>
          <span style={styles.welcome}>{user?.name}</span>
          <button style={styles.btnOutline} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Create Job */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Post a New Job</h3>
          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="Job Title" value={newJob.title}
              onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
            <input style={styles.input} placeholder="Department" value={newJob.department}
              onChange={e => setNewJob({ ...newJob, department: e.target.value })} />
            <input style={styles.input} placeholder="Description" value={newJob.description}
              onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
            <input style={styles.input} placeholder="Seats" type="number" value={newJob.seats}
              onChange={e => setNewJob({ ...newJob, seats: e.target.value })} />
            <select style={styles.input} value={newJob.branch}
              onChange={e => setNewJob({ ...newJob, branch: e.target.value })}>
              <option value="">Select Branch</option>
              {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <button style={styles.btnPrimary} onClick={createJob}>Post Job</button>
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Jobs List */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>All Jobs ({jobs.length})</h3>
            {jobs.map(job => (
              <div key={job._id} style={{
                ...styles.jobItem,
                borderColor: selectedJob?._id === job._id ? '#6366f1' : '#3a3a52'
              }}>
                <div>
                  <p style={styles.jobName}>{job.title}</p>
                  <p style={styles.jobMeta}>{job.department} — {job.branch?.name}</p>
                </div>
                <button style={styles.viewBtn} onClick={() => viewApplicants(job)}>
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Applicants */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              {selectedJob ? `Applicants — ${selectedJob.title}` : 'Select a job to view applicants'}
            </h3>
            {applications.length === 0 && selectedJob && (
              <p style={styles.empty}>No applicants yet.</p>
            )}
            {applications.map(app => (
              <div key={app._id} style={styles.appItem}>
                <div style={styles.appTop}>
                  <div>
                    <p style={styles.appName}>{app.candidate?.name}</p>
                    <p style={styles.appEmail}>{app.candidate?.email}</p>
                  </div>
                  <span style={{
                    ...styles.badge,
                    color: statusColor(app.status),
                    borderColor: statusColor(app.status)
                  }}>{app.status}</span>
                </div>
                <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                  <button style={styles.resumeBtn}>Resume</button>
                </a>
                <div style={styles.actionBtns}>
                  <button style={styles.shortlistBtn} onClick={() => updateStatus(app._id, 'Shortlisted')}>Shortlist</button>
                  <button style={styles.interviewBtn} onClick={() => updateStatus(app._id, 'Interview Scheduled')}>Interview</button>
                  <button style={styles.rejectBtn} onClick={() => updateStatus(app._id, 'Rejected')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
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
    fontSize: '18px',
  },
  btnPrimary: {
    background: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '10px 22px',
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
    maxWidth: '1200px',
    margin: '30px auto',
    padding: '0 20px',
  },
  card: {
    background: '#252538',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #3a3a52',
    marginBottom: '20px',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    alignItems: 'end',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #3a3a52',
    background: '#1e1e2e',
    color: '#e2e8f0',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  jobItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    marginBottom: '10px',
    background: '#1e1e2e',
  },
  jobName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
  },
  jobMeta: {
    color: '#64748b',
    fontSize: '14px',
    margin: '4px 0 0',
  },
  viewBtn: {
    background: 'transparent',
    color: '#818cf8',
    border: '1px solid #6366f1',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  appItem: {
    background: '#1e1e2e',
    padding: '16px',
    borderRadius: '10px',
    border: '1px solid #3a3a52',
    marginBottom: '12px',
  },
  appTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  appName: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
  },
  appEmail: {
    color: '#64748b',
    fontSize: '14px',
    margin: '3px 0 0',
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '99px',
    fontSize: '13px',
    border: '1px solid',
    background: 'transparent',
    whiteSpace: 'nowrap',
  },
  resumeBtn: {
    background: 'transparent',
    color: '#818cf8',
    border: '1px solid #6366f1',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '10px',
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
  shortlistBtn: {
    background: '#166534',
    color: '#4ade80',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  interviewBtn: {
    background: '#78350f',
    color: '#fbbf24',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  rejectBtn: {
    background: '#7f1d1d',
    color: '#f87171',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  empty: {
    color: '#64748b',
    fontSize: '16px',
    textAlign: 'center',
    padding: '20px',
  },
};

export default HRDashboard;