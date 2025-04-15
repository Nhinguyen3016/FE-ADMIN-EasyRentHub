import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      let user = null;
      
      try {
        if (userData) {
          user = JSON.parse(userData);
        }
      } catch (error) {
        console.error('Lỗi phân tích dữ liệu người dùng:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        navigate('/', { replace: true });
        return false;
      }
      
      const userRole = user?.role || localStorage.getItem('userRole');

      if (!token || !userData || !userRole || !allowedRoles.includes(userRole)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        navigate('/', { replace: true });
        return false;
      }
      
      return true;
    };
    
    checkAuthentication();
  }, [navigate, allowedRoles]);

  const isAuthenticated = localStorage.getItem('token') !== null;
  const userData = localStorage.getItem('user');
  let user = null;
  
  try {
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    return <Navigate to="/" replace />;
  }
  
  const userRole = user?.role || localStorage.getItem('userRole');
  
  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;