
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserManagement from '../src/page/Account/AccountManagementPage';
import './styles/Account/UserManagement.css';
import Login from '../src/page/login/LoginPage';
function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<UserManagement />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;