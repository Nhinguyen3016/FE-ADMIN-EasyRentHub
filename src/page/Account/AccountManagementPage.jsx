import React, { useState } from 'react';
import '../../styles/Account/UserManagement.css';
import logoImg from '../../images/logo.png';
import dashboardImg from '../../images/dashboard.png';
import userImg from '../../images/user.png';
import logoutImg from '../../images/logout.png';
import arrowImg from '../../images/arrow.png';
import addImg from '../../images/add.png';
import writeImg from '../../images/write.png';
import deleteImg from '../../images/delete.png';
import backgroundImg from '../../images/Home_background.jpg';

// Không cần import LoginPage nữa

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@example.com',
      address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
      role: 'Quản trị viên'
    },
    {
      id: 2,
      name: 'Trần Thị Bích Ngọc',
      email: 'bichngoc.tran@example.com',
      address: '45A Nguyễn Huệ, Quận Hải Châu, Đà Nẵng',
      role: 'Chủ nhà'
    },
    {
      id: 3,
      name: 'Lê Minh Hoàng',
      email: 'hoang.le@example.com',
      address: '78 Trường Chinh, Quận Thanh Xuân, Hà Nội',
      role: 'Người thuê'
    },
    {
      id: 4,
      name: 'Phạm Hồng Phúc',
      email: 'phuc.pham@example.com',
      address: '21 Đường 3/2, Quận Ninh Kiều, Cần Thơ',
      role: 'Người thuê'
    },
    {
      id: 5,
      name: 'Đặng Thị Thu Hương',
      email: 'thuhuong.dang@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Người thuê'
    }
  ]);
  
  // Mặc định là chuỗi rỗng để hiển thị tất cả vai trò
  const [selectedRole, setSelectedRole] = useState('');

  // Hàm xử lý khi chọn vai trò
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Lọc người dùng theo vai trò đã chọn
  const filteredUsers = selectedRole 
    ? users.filter(user => {
        if (selectedRole === 'admin') return user.role === 'Quản trị viên';
        if (selectedRole === 'owner') return user.role === 'Chủ nhà';
        if (selectedRole === 'tenant') return user.role === 'Người thuê';
        return true;
      })
    : users;

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEdit = (id) => {
    // Thực hiện chức năng chỉnh sửa
    console.log('Edit user with id:', id);
  };

  const handleAddUser = () => {
    // Thực hiện chức năng thêm người dùng
    console.log('Add new user');
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Chuyển đến trang đăng nhập bằng window.location
    window.location.href = '/login';
    
    // Hoặc nếu bạn biết đường dẫn chính xác:
    // window.location.href = '/đường-dẫn-đến/login';
  };

  return (
    <div className="user-management-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={logoImg} alt="EasyRentHub Logo" className="logo" />
          <p className="logo-text">An easy and convenient<br />rental connection platform</p>
        </div>
        <div className="menu">
          <div className="menu-item">
            <img src={dashboardImg} alt="Dashboard" className="menu-icon" />
            <span className="menu-text">Thống kê kinh doanh</span>
          </div>
          <div className="menu-item active">
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
        
        {/* User Table Container */}
        <div className="user-table-container">
          <div className="table-actions">
            <div className="role-dropdown">
              <select value={selectedRole} onChange={handleRoleChange}>
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="owner">Chủ nhà</option>
                <option value="tenant">Người thuê</option>
              </select>
              <img src={arrowImg} alt="Dropdown arrow" className="dropdown-arrow" />
            </div>
            
            <button className="add-button" onClick={handleAddUser}>
              <img src={addImg} alt="Add" className="add-icon" />
              <span>Tạo mới</span>
            </button>
          </div>
          
          {/* User Table with filtered data */}
          <table className="user-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                    <td className="action-buttons">
                      <button className="edit-button" onClick={() => handleEdit(user.id)}>
                        <img src={writeImg} alt="Edit" className="edit-icon" />
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(user.id)}>
                        <img src={deleteImg} alt="Delete" className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-users-message">Không tìm thấy người dùng với vai trò này</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;