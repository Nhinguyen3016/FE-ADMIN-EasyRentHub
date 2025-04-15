import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './mainLayout/MainLayout';
import UserManagement from './page/Account/AccountManagementPage';
import Dashboard from './page/dashboard/DashboardPage';
import PostManagementPage from './page/post/PostManagementPage';
import LoginPage from './page/login/LoginPage';
import RegisterPage from './page/register/RegisterPage';
import MessageManagement from './page/notification/messageManagement/MessageManagement';
import ProtectedRoute from './components/ProtectedRoute';
import EditForm from './page/post/components/EstateEditForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<UserManagement />} />
            <Route path="/post" element={<PostManagementPage />} />
            <Route path="/messageManagement" element={<MessageManagement />} />
            <Route path="/editform" element={<EditForm />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;