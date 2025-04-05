import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../src/mainLayout/MainLayout';
import UserManagement from './page/Account/AccountManagementPage';
import Dashboard from './page/dashboard/DashboardPage';
import PostManagementPage from './page/post/PostManagementPage';
import LoginPage from './page/login/LoginPage';
 import RegisterPage from './page/register/RegisterPage';
 import Notification from'./page/notification/NotificationPage';
 import MessageDialog from'./page/messageDialog/MessageDialog';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<UserManagement />} />
          <Route path="/post" element={<PostManagementPage />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/messageDialog" element={<MessageDialog />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;