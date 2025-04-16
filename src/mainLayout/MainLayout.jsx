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
    <div className="main-layout-container-mlo">
      {/* Sidebar */}
      <div className="sidebar-mlo">
        <div className="logo-container-mlo">
          <img src={logoImg} alt="EasyRentHub Logo" className="logo-mlo" />
          <p className="logo-text-mlo">Nền tảng kết nối cho thuê<br />dễ dàng và tiện lợi</p>
          </div>
        <div className="menu-mlo">
          <Link to="/dashboard" className="menu-link-mlo">
            <div className={`menu-item-mlo ${activePage === 'dashboard' ? 'active' : ''}`}>
              <img src={dashboardImg} alt="Dashboard" className="menu-icon-mlo" />
              <span className="menu-text-mlo">Thống kê kinh doanh</span>
            </div>
          </Link>
          <Link to="/account" className="menu-link-mlo">
            <div className={`menu-item-mlo ${activePage === 'user' ? 'active' : ''}`}>
              <img src={userImg} alt="User" className="menu-icon-mlo" />
              <span className="menu-text-mlo">Quản lý tài khoản</span>
            </div>
          </Link>
          <Link to="/post" className="menu-link-mlo">
            <div className={`menu-item-mlo ${activePage === 'post' ? 'active' : ''}`}>
              <img src={postImg} alt="Post" className="menu-icon-mlo" />
              <span className="menu-text-mlo">Quản lý bài đăng</span>
            </div>
          </Link>
          <Link to="/messageManagement" className="menu-link-mlo">
            <div className={`menu-item-mlo ${activePage === 'messageManagement' ? 'active' : ''}`}>
              <img src={notificationImg} alt="Notification" className="menu-icon-mlo" />
              <span className="menu-text-mlo">Quản lý tin nhắn</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content-mlo">
        {/* Top Navigation Bar */}
        <div className="top-nav-bar-mlo">
          <div className="logout-container-mlo">
            <div className="logout-button-mlo" onClick={handleLogout}>
              <img src={logoutImg} alt="Logout" className="logout-icon-mlo" />
              <span>Đăng xuất</span>
            </div>
          </div>
        </div>

        {/* Header with background image */}
        <div className="header-mlo" style={{ backgroundImage: `url(${backgroundImg})` }}>
          <div className="header-overlay-mlo">
            <div className="header-title-mlo">EasyRentHub</div>
          </div>
        </div>

        <div className="content-area-mlo">
          <div className="content-frame-mlo">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;