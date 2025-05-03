import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import CreateObjective from './components/admin/CreateObjective.jsx';
import UpdateObjectives from './components/admin/UpdateObjectives';
import { ObjectiveProvider } from './context/ObjectiveContext';
import './App.css';

function App() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  const handleLogin = (userData: { username: string; role: string }) => {
    setUser(userData);
  };

  return (
    <ObjectiveProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/admin/dashboard"
              element={
                user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/create-objective"
              element={
                user?.role === 'admin' ? (
                  <CreateObjective />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/update-objectives"
              element={
                user?.role === 'admin' ? (
                  <UpdateObjectives />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </ObjectiveProvider>
  );
}

export default App;
