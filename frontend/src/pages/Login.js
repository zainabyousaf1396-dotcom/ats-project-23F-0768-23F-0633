import React, { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'hr') navigate('/hr');
      else navigate('/candidate');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your ATS account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button style={styles.button} type="submit">Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register" style={styles.linkColor}>Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f5f5f5',
  },
  box: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid #e0e0e0',
    width: '400px',
  },
  title: {
    color: '#000000',
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '6px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666666',
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '14px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    background: '#ffffff',
    color: '#1e1e2e',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '4px',
  },
  error: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: '12px',
    fontSize: '15px',
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '16px',
    color: '#666666',
  },
  linkColor: {
    color: '#818cf8',
    textDecoration: 'none',
  },
};

export default Login;