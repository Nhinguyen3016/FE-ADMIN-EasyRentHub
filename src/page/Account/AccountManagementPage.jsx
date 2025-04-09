import React, { useState } from 'react';
// Import các biểu tượng từ thư viện của bạn hoặc sử dụng các hình ảnh đã có
import arrowImg from '../../images/arrow.png';
import addImg from '../../images/add.png';
import seeImg from '../../images/see.png';
import writeImg from '../../images/write.png';
import deleteImg from '../../images/delete.png';
// Import các components
import UpdatePage from './components/UpdatePage';
import SeeDetailPage from './components/SeeDetailPage';
import AddAccountPage from './components/AddAccountPage';
// Import CSS
import '../../styles/Account/UserManagement.css';

const AccountManagementPage = () => {
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
      role: 'Chủ nhà'
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
      name: 'Đặng Thu Hương',
      email: 'thuhuong.dang@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Người thuê'
    },
    {
      id: 6,
      name: 'Đinh Hương',
      email: 'dinh.huong@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Chủ nhà'
    },
    {
      id: 7,
      name: 'Đặng Minh',
      email: 'minh.dang@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Người thuê'
    },
    {
      id: 8,
      name: 'Thu Hương',
      email: 'thu.huong@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Người thuê'
    },
    {
      id: 9,
      name: 'Đặng Thị',
      email: 'thi.dang@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Người thuê'
    },
    {
      id: 10,
      name: 'Đặng Thị Thu',
      email: 'thithu.dang@example.com',
      address: '56 Hoàng Diệu, TP. Nha Trang, Khánh Hòa',
      role: 'Người thuê'
    }
  ]);

  // Default empty string for role filtering
  const [selectedRole, setSelectedRole] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter users by role and search query
  const filteredUsers = users.filter(user => {
    const roleMatches = selectedRole
      ? (selectedRole === 'admin' ? user.role === 'Quản trị viên' :
         selectedRole === 'owner' ? user.role === 'Chủ nhà' :
         selectedRole === 'tenant' ? user.role === 'Người thuê' : true)
      : true;
    
    const searchMatches = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.address.toLowerCase().includes(searchQuery.toLowerCase());

    return roleMatches && searchMatches;
  });

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find(user => user.id === id);
    setSelectedUser(userToEdit);
    setIsUpdateModalOpen(true);
  };

  const handleViewUser = (id) => {
    const userToView = users.find(user => user.id === id);
    setSelectedUser(userToView);
    setIsDetailModalOpen(true);
  };

  const handleAddUser = () => {
    // Mở modal thêm tài khoản mới
    setIsAddModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = (updatedUserData) => {
    // Update existing user
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...updatedUserData } 
        : user
    ));
    
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleCreateUser = (newUserData) => {
    // Add new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      ...newUserData
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="user-table-container">
      <h1 className="account-management-title">Quản lý tài khoản</h1>
      
      <div className="table-actions">
        {/* Search input field - căn trái */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Container cho các thành phần bên phải */}
        <div className="right-actions">
          <div className="role-dropdown-acc">
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
      </div>

      {/* User Table with filtered data */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <span className={`role-badge ${
                    user.role === 'Quản trị viên' ? 'admin-role' :
                    user.role === 'Chủ nhà' ? 'owner-role' : 'tenant-role'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="see-button" onClick={() => handleViewUser(user.id)}>
                    <img src={seeImg} alt="Xem" className="see-icon" />
                  </button>
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
              <td colSpan="5" className="no-users-message">Không tìm thấy người dùng phù hợp</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Thêm tài khoản mới Modal */}
      {isAddModalOpen && (
        <AddAccountPage 
          onClose={handleCloseAddModal}
          onAdd={handleCreateUser}
        />
      )}
      
      {/* Cập nhật thông tin Modal */}
      {isUpdateModalOpen && (
        <UpdatePage 
          user={selectedUser}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Xem chi tiết Modal */}
      {isDetailModalOpen && (
        <SeeDetailPage 
          user={selectedUser}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default AccountManagementPage;