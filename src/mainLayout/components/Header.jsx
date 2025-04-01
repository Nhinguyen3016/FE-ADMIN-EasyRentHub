// Header.js
import React from 'react';
import logoutImg from '../../images/logout.png';
import backgroundImg from '../../images/Home_background.jpg';

const Header = ({ onLogout }) => {
  return (
    <>
      {/* Top Navigation Bar */}
      <div className="top-nav-bar">
        <div className="logout-container">
          <div className="logout-button" onClick={onLogout}>
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
    </>
  );
};

export default Header;