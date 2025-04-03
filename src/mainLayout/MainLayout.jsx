import React from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import '../styles/mainLayout/MainLayout.css';
import logoImg from '../images/logo.png';
import dashboardImg from '../images/dashboard.png';
import postImg from '../images/postmagement.png';
import userImg from '../images/user.png';
import logoutImg from '../images/logout.png';
import backgroundImg from '../images/Home_background.jpg';

const MainLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
 
  const getActivePage = () => {
    if (pathname === '/') return 'dashboard';
    if (pathname === '/account') return 'account';
    if (pathname === '/post') return 'post';
    return '';
  };
  
  const activePage = getActivePage();
 
  const handleLogout = () => {
    window.location.href = '/login';
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
          <Link to="/" className="menu-link">
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
        
        {/* Content area with content frame */}
        <div className="content-area">
          <div className="content-frame">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;