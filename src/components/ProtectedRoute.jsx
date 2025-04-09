import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Kiểm tra xem người dùng đã xác thực và có vai trò cần thiết hay không
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userRole = user?.role || '';
  
  // Nếu chưa xác thực hoặc không có vai trò cần thiết, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }
  
  // Nếu đã xác thực và có vai trò cần thiết, hiển thị các route con
  return <Outlet />;
};

export default ProtectedRoute;