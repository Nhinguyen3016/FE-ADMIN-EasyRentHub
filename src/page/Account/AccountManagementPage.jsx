import React, { useState } from 'react';
import '../../styles/Account/UserManagement.css';
import arrowImg from '../../images/arrow.png';
import addImg from '../../images/add.png';
import seeImg from '../../images/see.png';
import writeImg from '../../images/write.png';
import deleteImg from '../../images/delete.png';

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
    console.log('Edit user with id:', id);
  };

  const handleAddUser = () => {
    console.log('Add new user');
  };

  return (

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
                    <button className="see-button" onClick={() => handleEdit(user.id)}>
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
                <td colSpan="5" className="no-users-message">Không tìm thấy người dùng với vai trò này</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
 
  );
};

export default AccountManagementPage;