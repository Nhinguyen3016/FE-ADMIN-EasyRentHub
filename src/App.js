
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserManagement from '../src/page/Account/AccountManagementPage';
import './styles/Account/UserManagement.css';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/user-management" element={<UserManagement />} />
      
      </Routes>
    </Router>
  );
}

export default App;