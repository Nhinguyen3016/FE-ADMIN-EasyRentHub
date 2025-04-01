import React from 'react';
import '../styles/mainLayout/MainLayout.css';
import logoImg from '../../src/images/logo.png';
import dashboardImg from '../../src/images/dashboard.png';
import userImg from '../../src/images/user.png';
import logoutImg from '../../src/images/logout.png';

const MainLayout = ({ children, activeMenuItem, backgroundImg }) => {
  return (
    <div className="main-layout-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logoImg} alt="EasyRentHub Logo" className="logo" />
          <p className="logo-text">An easy and convenient<br />rental connection platform</p>
        </div>
        <div className="menu">
          <div className={`menu-item ${activeMenuItem === 'dashboard' ? 'active' : ''}`}>
            <img src={dashboardImg} alt="Dashboard" className="menu-icon" />
            <span className="menu-text">Thống kê kinh doanh</span>
          </div>
          <div className={`menu-item ${activeMenuItem === 'users' ? 'active' : ''}`}>
            <img src={userImg} alt="User" className="menu-icon" />
            <span className="menu-text">Quản lý tài khoản</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation Bar */}
        <div className="top-nav-bar">
          <div className="logout-container">
            <div className="logout-button">
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
        
        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;