import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import HRDashboard from './pages/HRDashboard';
import JobDetails from './pages/JobDetails';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Login />} />
          
          <Route path="/register" element={<Register />} />
          
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route
            path="/candidate"
            element={
              user?.role === 'candidate' ? (
                <CandidateDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/hr"
            element={
              user?.role === 'hr' ? (
                <HRDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;