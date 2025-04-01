// Sidebar.js
import React from 'react';
import logoImg from '../../images/logo.png';
import dashboardImg from '../../images/dashboard.png';
import userImg from '../../images/user.png';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activePage }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logoImg} alt="EasyRentHub Logo" className="logo" />
        <p className="logo-text">An easy and convenient<br />rental connection platform</p>
      </div>
      <div className="menu">
        <div 
          className={`menu-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigation('/dashboard')}
        >
          <img src={dashboardImg} alt="Dashboard" className="menu-icon" />
          <span className="menu-text">Thống kê kinh doanh</span>
        </div>
        <div 
          className={`menu-item ${activePage === 'userManagement' ? 'active' : ''}`}
          onClick={() => handleNavigation('/user-management')}
        >
          <img src={userImg} alt="User" className="menu-icon" />
          <span className="menu-text">Quản lý tài khoản</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;