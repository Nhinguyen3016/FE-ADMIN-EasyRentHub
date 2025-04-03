import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../src/mainLayout/MainLayout';
import UserManagement from './page/Account/AccountManagementPage';
import Dashboard from './page/dashboard/DashboardPage';
import PostManagementPage from './page/post/PostManagementPage';
import LoginPage from './page/login/LoginPage';
// import RegisterPage from './page/register/RegisterPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/account" element={<UserManagement />} />
          <Route path="/post" element={<PostManagementPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
       {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;