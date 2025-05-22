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

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-confirm-modal">
        <div className="delete-modal-content">
          <div className="delete-icon-container">
            <div className="delete-icon">
              <span className="exclamation-mark">!</span>
            </div>
          </div>

          <h3 className="delete-modal-title">Xóa tài khoản</h3>

          <p className="delete-modal-text">
            Bạn có chắc chắn muốn xóa tài khoản này không?
            <br />
            Hành động này không thể hoàn tác.
          </p>

          <div className="delete-modal-buttons">
            <button className="cancel-button" onClick={onClose}>
              Đóng
            </button>
            <button className="confirm-delete-button" onClick={onConfirm}>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [toasts, setToasts] = useState([]);

  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');
  
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };
  
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

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
      addToast(`Lỗi khi tải dữ liệu: ${err.message}`, 'error');
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRole, searchQuery]);

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

 
    const searchQueryTrimmed = searchQuery.trim();
    const isSearching = searchQuery !== '' && searchQueryTrimmed === '';
    
   
    if (isSearching) {
      return false;
    }
    
 
    if (!searchQueryTrimmed) {
      return roleMatches;
    }

    const searchTerm = searchQueryTrimmed.toLowerCase();
    const userName = user.name ? user.name.toLowerCase() : '';
    const userEmail = user.email ? user.email.toLowerCase() : '';
    const userAddress = user.address ? user.address.toLowerCase() : '';
    const nameMatch = userName.includes(searchTerm);
    const emailMatch = userEmail.includes(searchTerm);
    const addressMatch = userAddress.includes(searchTerm);
    return roleMatches && (nameMatch || emailMatch || addressMatch);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openDeleteModal = (id) => {
    const userToDelete = users.find(user => user.id === id);
    setUserToDelete(userToDelete);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/user/${userToDelete.id}`, {
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

      setUsers(users.filter(user => user.id !== userToDelete.id));

      const newFilteredUsers = users.filter(user => user.id !== userToDelete.id).filter(user => {
        const roleMatches = selectedRole
          ? (selectedRole === 'admin' ? user.role === 'Quản trị viên' :
            selectedRole === 'owner' ? user.role === 'Chủ nhà' :
              selectedRole === 'tenant' ? user.role === 'Người thuê' : true)
          : true;

        const searchTerm = searchQuery.toLowerCase().trim();
        if (!searchTerm) return roleMatches;
        
        const userName = user.name ? user.name.toLowerCase() : '';
        const userEmail = user.email ? user.email.toLowerCase() : '';
        const userAddress = user.address ? user.address.toLowerCase() : '';
        
        return roleMatches && (userName.includes(searchTerm) || userEmail.includes(searchTerm) || userAddress.includes(searchTerm));
      });

      const newTotalPages = Math.ceil(newFilteredUsers.length / itemsPerPage);
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(newTotalPages || 1);
      }
 
      addToast('Xóa người dùng thành công');
      
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      addToast(`Lỗi khi xóa người dùng: ${err.message}`, 'error');
      closeDeleteModal();
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
    addToast('Cập nhật người dùng thành công');
  };

  const handleCreateUser = async (newUserData) => {
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      ...newUserData
    };
    setUsers([...users, newUser]);
    setIsAddModalOpen(false);

    await fetchUsers();
    addToast('Tạo người dùng mới thành công');
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];

    pageButtons.push(
      <button
        key="prev"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button prev-button"
      >
        &laquo;
      </button>
    );

    if (currentPage > 3) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => paginate(1)}
          className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );

      if (currentPage > 4) {
        pageButtons.push(
          <span key="ellipsis1" className="pagination-ellipsis">...</span>
        );
      }
    }

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 3) {
      pageButtons.push(
        <span key="ellipsis2" className="pagination-ellipsis">...</span>
      );
    }
    if (totalPages > 1 && currentPage < totalPages - 2) {
      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => paginate(totalPages)}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }

    pageButtons.push(
      <button
        key="next"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button next-button"
      >
        &raquo;
      </button>
    );

    return pageButtons;
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="user-table-container">
      {/* Toast notifications container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
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

      {/* Table container with horizontal scroll */}
      <div className="table-wrapper">
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
            {currentItems.length > 0 ? (
              currentItems.map(user => (
                <tr key={user.id}>
                  <td title={user.name}>{user.name}</td>
                  <td title={user.email}>{user.email}</td>
                  <td title={user.address}>{user.address}</td>
                  <td>
                    <span className={`role-badge ${user.role === 'Quản trị viên' ? 'admin-role' :
                      user.role === 'Chủ nhà' ? 'owner-role' : 'tenant-role'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="see-button" onClick={() => handleViewUser(user.id)}>
                        <img src={seeImg} alt="Xem" className="see-icon" />
                      </button>
                      <button className="edit-button" onClick={() => handleEdit(user.id)}>
                        <img src={writeImg} alt="Edit" className="edit-icon" />
                      </button>
                      <button className="delete-button" onClick={() => openDeleteModal(user.id)}>
                        <img src={deleteImg} alt="Delete" className="delete-icon" />
                      </button>
                    </div>
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
      </div>

      {/* Pagination controls */}
      {filteredUsers.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredUsers.length)} trên {filteredUsers.length} người dùng
          </div>
          <div className="pagination-controls">
            {renderPaginationButtons()}
          </div>
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        userName={userToDelete?.name}
      />
    </div>
  );
};

export default AccountManagementPage;