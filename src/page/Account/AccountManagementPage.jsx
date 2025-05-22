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
  const [selectedStatus, setSelectedStatus] = useState('');
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
        // Format address in simple comma-separated format
        let formattedAddress = '';
        if (user.address) {
          const addressParts = [];
          
          if (user.address.name) {
            addressParts.push(user.address.name);
          }
          if (user.address.road) {
            addressParts.push(user.address.road);
          }
          if (user.address.quarter) {
            addressParts.push(user.address.quarter);
          }
          if (user.address.city) {
            addressParts.push(user.address.city);
          }
          if (user.address.country) {
            addressParts.push(user.address.country);
          }
          
          formattedAddress = addressParts.join(', ');
        }

        // Đảm bảo status được xử lý đúng cách
        const userStatus = user.status !== undefined ? user.status : 1;
        
        return {
          id: user._id,
          name: user.full_name,
          email: user.email,
          address: formattedAddress || 'Chưa có địa chỉ',
          role: user.role === 'Admin' ? 'Quản trị viên' :
            user.role === 'Landlord' ? 'Chủ nhà' : 'Người thuê',
          status: userStatus,
          statusText: userStatus === 1 ? 'Hoạt động' : 'Không hoạt động',
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
  }, [selectedRole, selectedStatus, searchQuery]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fixed filtering logic
  const filteredUsers = users.filter(user => {
    // Role filter
    let roleMatches = true;
    if (selectedRole) {
      switch(selectedRole) {
        case 'admin':
          roleMatches = user.role === 'Quản trị viên';
          break;
        case 'owner':
          roleMatches = user.role === 'Chủ nhà';
          break;
        case 'tenant':
          roleMatches = user.role === 'Người thuê';
          break;
        default:
          roleMatches = true;
          break;
      }
    }

    // Status filter - Fixed logic
    let statusMatches = true;
    if (selectedStatus) {
      switch(selectedStatus) {
        case 'active':
          statusMatches = user.status === 1;
          break;
        case 'inactive':
          statusMatches = user.status === 0;
          break;
        default:
          statusMatches = true;
          break;
      }
    }

    // Search filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return roleMatches && statusMatches && matchesSearch;
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

      // Update pagination if needed
      const newFilteredUsers = users.filter(user => user.id !== userToDelete.id).filter(user => {
        let roleMatches = true;
        if (selectedRole) {
          switch(selectedRole) {
            case 'admin':
              roleMatches = user.role === 'Quản trị viên';
              break;
            case 'owner':
              roleMatches = user.role === 'Chủ nhà';
              break;
            case 'tenant':
              roleMatches = user.role === 'Người thuê';
              break;
            default:
              roleMatches = true;
              break;
          }
        }

        let statusMatches = true;
        if (selectedStatus) {
          switch(selectedStatus) {
            case 'active':
              statusMatches = user.status === 1;
              break;
            case 'inactive':
              statusMatches = user.status === 0;
              break;
            default:
              statusMatches = true;
              break;
          }
        }

        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        return roleMatches && statusMatches && matchesSearch;
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

          <div className="role-dropdown-acc">
            <select value={selectedStatus} onChange={handleStatusChange}>
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
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
        <div className="table-scroll-container">
          <table className="user-table">
            <thead>
              <tr>
                <th className="scrollable-column">Tên</th>
                <th className="scrollable-column">Email</th>
                <th className="scrollable-column">Địa chỉ</th>
                <th className="scrollable-column">Vai trò</th>
                <th className="scrollable-column">Trạng thái</th>
                <th className="fixed-column">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(user => (
                  <tr key={user.id}>
                    <td className="scrollable-column" title={user.name}>{user.name}</td>
                    <td className="scrollable-column" title={user.email}>{user.email}</td>
                    <td className="scrollable-column" title={user.address}>{user.address}</td>
                    <td className="scrollable-column">
                      <span className={`role-badge ${user.role === 'Quản trị viên' ? 'admin-role' :
                        user.role === 'Chủ nhà' ? 'owner-role' : 'tenant-role'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="scrollable-column">
                      <span className={`status-badge ${user.status === 1 ? 'active-status' : 'inactive-status'}`}>
                        {user.statusText}
                      </span>
                    </td>
                    <td className="fixed-column">
                      <div className="action-buttons">
                        <button className="see-button" onClick={() => handleViewUser(user.id)} title="Xem chi tiết">
                          <img src={seeImg} alt="Xem" className="see-icon" />
                        </button>
                        <button className="edit-button" onClick={() => handleEdit(user.id)} title="Chỉnh sửa">
                          <img src={writeImg} alt="Edit" className="edit-icon" />
                        </button>
                        <button className="delete-button" onClick={() => openDeleteModal(user.id)} title="Xóa">
                          <img src={deleteImg} alt="Delete" className="delete-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="scrollable-column no-users-message">Không tìm thấy người dùng phù hợp</td>
                  <td className="fixed-column"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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