import React from 'react';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import PasswordResetPage from './components/PasswordResetPage';
import Dashboard from './components/Dashboard';
import { Routes, Route } from 'react-router-dom';

const App = () => {

  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
};

export default App;