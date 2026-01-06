import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('userRole');
    
    if (token && savedRole) {
      // Verify token is still valid
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp > currentTime) {
          setRole(savedRole);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        // Invalid token, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }
    setLoading(false);
  }, []);

  const handleSetRole = (userRole) => {
    setRole(userRole);
    localStorage.setItem('userRole', userRole);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage setRole={handleSetRole} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role={role} requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role={role} requiredRole="teacher">
                <TeacherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute role={role} requiredRole="student">
                <StudentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;