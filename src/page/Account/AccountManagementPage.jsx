import React, { useState, useEffect, useCallback } from 'react';
import arrowImg from '../../images/arrow.png';
import addImg from '../../images/add.png';
import seeImg from '../../images/see.png';
import writeImg from '../../images/write.png';
import deleteImg from '../../images/delete.png';
import UpdatePage from './components/UpdatePage';
import SeeDetailPage from './components/SeeDetailPage';
import AddAccountPage from './components/AddAccountPage';
import '../../styles/Account/UserManagement.css';

const AccountManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      const formattedUsers = data.users.map(user => {
        return {
          id: user._id,
          name: user.full_name,
          email: user.email,
          address: user.address.name || 
                  [user.address.road, user.address.quarter, user.address.city, user.address.country]
                  .filter(Boolean).join(', '),
          role: user.role === 'Admin' ? 'Quản trị viên' : 
               user.role === 'Landlord' ? 'Chủ nhà' : 'Người thuê',
          avatar: user.avatar,
          originalData: user
        };
      });
      
      setUsers(formattedUsers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error fetching users:', err);
    }
  }, [token]);

  useEffect(() => {
    if (userRole) {
      fetchUsers();
    } else {
      setError('Không có quyền truy cập');
      setLoading(false);
    }
  }, [userRole, fetchUsers]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể xóa người dùng');
        }

        setUsers(users.filter(user => user.id !== id));
        alert('Xóa người dùng thành công');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert(`Lỗi khi xóa người dùng: ${err.message}`);
      }
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

  const handleUpdateUser = async (updatedUserData) => {
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...updatedUserData } 
        : user
    ));
    
    setIsUpdateModalOpen(false);
    setSelectedUser(null);
    
    await fetchUsers();
  };

  const handleCreateUser = async (newUserData) => {
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      ...newUserData
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    
    await fetchUsers();
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="user-table-container">
      <h1 className="account-management-title">Quản lý tài khoản</h1>
      
      <div className="table-actions">
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
      
      {isAddModalOpen && (
        <AddAccountPage 
          onClose={handleCloseAddModal}
          onAdd={handleCreateUser}
        />
      )}
      
      {isUpdateModalOpen && (
        <UpdatePage 
          user={selectedUser}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateUser}
        />
      )}

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