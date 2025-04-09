import React from 'react';
import { useLocation, Outlet, Link, useNavigate } from 'react-router-dom';
import '../styles/mainLayout/MainLayout.css';
import logoImg from '../images/logo.png';
import dashboardImg from '../images/dashboard.png';
import postImg from '../images/postmagement.png';
import userImg from '../images/user.png';
import logoutImg from '../images/logout.png';
import backgroundImg from '../images/Home_background.jpg';
import notificationImg from '../images/notification.png';  

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const getActivePage = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/account') return 'user';
    if (pathname === '/post') return 'post';
    if (pathname === '/messageManagement') return 'messageManagement';
    return '';
  };

  const activePage = getActivePage();

  const handleLogout = async () => {
    try {
      
      const token = localStorage.getItem('token');
      
      if (!token) {
       
        localStorage.clear();
        navigate('/');
        return;
      }
      
    
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('refreshToken');
      
      console.log('Đăng xuất thành công');
   
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
   
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div className="main-layout-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logoImg} alt="EasyRentHub Logo" className="logo" />
          <p className="logo-text">An easy and convenient<br />rental connection platform</p>
        </div>
        <div className="menu">
          <Link to="/dashboard" className="menu-link">
            <div className={`menu-item ${activePage === 'dashboard' ? 'active' : ''}`}>
              <img src={dashboardImg} alt="Dashboard" className="menu-icon" />
              <span className="menu-text">Thống kê kinh doanh</span>
            </div>
          </Link>
          <Link to="/account" className="menu-link">
            <div className={`menu-item ${activePage === 'user' ? 'active' : ''}`}>
              <img src={userImg} alt="User" className="menu-icon" />
              <span className="menu-text">Quản lý tài khoản</span>
            </div>
          </Link>
          <Link to="/post" className="menu-link">
            <div className={`menu-item ${activePage === 'post' ? 'active' : ''}`}>
              <img src={postImg} alt="Post" className="menu-icon" />
              <span className="menu-text">Quản lý bài đăng</span>
            </div>
          </Link>
          <Link to="/messageManagement" className="menu-link">
            <div className={`menu-item ${activePage === 'messageManagement' ? 'active' : ''}`}>
              <img src={notificationImg} alt="Notification" className="menu-icon" />
              <span className="menu-text">Quản lý tin nhắn</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation Bar */}
        <div className="top-nav-bar">
          <div className="logout-container">
            <div className="logout-button" onClick={handleLogout}>
              <img src={logoutImg} alt="Logout" className="logout-icon" />
              <span>Đăng xuất</span>
            </div>
          </div>
        </div>

        {/* Header with background image */}
        <div className="header" style={{ backgroundImage: `url(${backgroundImg})` }}>
          <div className="header-overlay">
            <div className="header-title">EasyRentHub</div>
          </div>
        </div>

        <div className="content-area full-width">
          <div className="content-frame">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;