import React, { useState, useEffect } from 'react';
import '../../../styles/Account/components/SeeDetailPage.css';
import avatar from '../../../images/loopy1.jpg';

const SeeDetailPage = ({ user, onClose }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: {},
    role: '',
    avatar: null,
    createdAt: '',
    updatedAt: ''
  });
  
  const [focusedField, setFocusedField] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        address: user.originalData?.address || {},
        role: user.role || 'Admin',
        avatar: user.avatar || null,
        createdAt: user.originalData?.createdAt || '',
        updatedAt: user.originalData?.updatedAt || ''
      });
  
      if (user._id || user.id) {
        fetchActivityHistory(user._id || user.id);
      }
    }
  }, [user]);
  
  const fetchActivityHistory = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); 
    
      let response = await fetch(`http://localhost:5000/api/user-activity?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
 
      if (!response.ok) {
        console.log('Trying alternative API endpoint...');
        response = await fetch(`http://localhost:5000/api/user-activity/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.activities) {
        setActivityHistory(data.activities);
      } else {
        setActivityHistory([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching activity history:', err);
      setError('Failed to load activity history');
      setActivityHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getFormattedAddress = () => {
    if (typeof userData.address === 'string') return userData.address;
    
    if (userData.address?.name) return userData.address.name;
    
    return [
      userData.address?.road,
      userData.address?.quarter,
      userData.address?.city,
      userData.address?.country
    ].filter(Boolean).join(', ');
  };
  
  const getActivityTitle = (activityType) => {
    switch(activityType) {
      case 'login':
        return 'Đăng nhập';
      case 'logout':
        return 'Đăng xuất';
      case 'create':
        return 'Tạo mới';
      case 'update':
        return 'Cập nhật thông tin';
      case 'delete':
        return 'Xóa';
      case 'report':
        return 'Tạo báo cáo';
      case 'add':
        return 'Thêm';
      default:
        return activityType || 'Hoạt động';
    }
  };

  const getActivityIconClass = (type) => {
    switch(type) {
      case 'login':
        return 'activity-icon-login';
      case 'logout':
        return 'activity-icon-login';
      case 'create':
        return 'activity-icon-add';
      case 'update':
        return 'activity-icon-update';
      case 'delete':
        return 'activity-icon-delete';
      case 'report':
        return 'activity-icon-report';
      case 'add':
        return 'activity-icon-add';
      default:
        return 'activity-icon-default';
    }
  };
  
  const formatActivityDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString('vi-VN')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };
  
  const validActivityHistory = Array.isArray(activityHistory) ? activityHistory : [];
  const totalPages = Math.max(1, Math.ceil(validActivityHistory.length / itemsPerPage));
  

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentItems = validActivityHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="detail-page-container-seedp">
      <div className="detail-page-content-seedp">
        <h1 className="detail-page-title-seedp">
          Chi tiết tài khoản
          <span className="title-icon-seedp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </h1>
        
        <div className="detail-form-container-seedp">
          <div className="avatar-section-seedp">
            <div className="avatar-container-seedp">
              <div className="avatar-circle-seedp">
                <img 
                  src={userData.avatar || avatar} 
                  alt="Ảnh đại diện" 
                  className="avatar-preview-seedp" 
                />
              </div>
              <span className="avatar-label-seedp">Ảnh đại diện</span>
            </div>
          </div>
          
          <div className="detail-form-seedp">
            <div className="form-group-seedp">
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                placeholder="Họ và tên"
                className={`form-input-seedp ${focusedField === 'name' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-seedp">Họ và tên</label>
            </div>
            
            <div className="form-group-seedp">
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                placeholder="Email"
                className={`form-input-seedp ${focusedField === 'email' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-seedp">Email</label>
            </div>
            
            <div className="form-group-seedp">
              <input
                type="text"
                id="address"
                name="address"
                value={getFormattedAddress()}
                placeholder="Địa chỉ"
                className={`form-input-seedp ${focusedField === 'address' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-seedp">Địa chỉ</label>
            </div>
            
            <div className="form-group-seedp">
              <select
                id="role"
                name="role"
                value={userData.role}
                className={`form-select-seedp ${focusedField === 'role' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('role')}
                onBlur={handleBlur}
                disabled
              >
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Chủ nhà">Chủ nhà</option>
                <option value="Người thuê">Người thuê</option>
              </select>
              <label className="form-label-seedp">Vai trò</label>
            </div>
            
            <div className="form-group-seedp">
              <input
                type="text"
                id="createdAt"
                name="createdAt"
                value={formatDate(userData.createdAt)}
                placeholder="Ngày tạo"
                className={`form-input-seedp ${focusedField === 'createdAt' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('createdAt')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-seedp">Ngày tạo</label>
            </div>
            
            <div className="form-group-seedp">
              <input
                type="text"
                id="updatedAt"
                name="updatedAt"
                value={formatDate(userData.updatedAt)}
                placeholder="Ngày cập nhật"
                className={`form-input-seedp ${focusedField === 'updatedAt' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('updatedAt')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-seedp">Ngày cập nhật</label>
            </div>
          </div>
        </div>
        
        <div className="activity-history-section-seedp">
          <h2 className="activity-history-title-seedp">Lịch sử hoạt động</h2>
          
          {loading ? (
            <div className="loading-indicator-seedp">Đang tải...</div>
          ) : error ? (
            <div className="error-message-seedp">{error}</div>
          ) : validActivityHistory.length === 0 ? (
            <div className="empty-state-seedp">Không có hoạt động nào</div>
          ) : (
            <div className="activity-list-seedp">
              {currentItems.map((activity, index) => (
                <div key={activity._id || `activity-${index}`} className="activity-item-seedp">
                  <div className={`activity-icon-seedp ${getActivityIconClass(activity.activityType)}`}>
                    {activity.activityType === 'login' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>
                    )}
                    {activity.activityType === 'logout' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                    )}
                    {activity.activityType === 'update' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    )}
                    {activity.activityType === 'report' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                    )}
                    {activity.activityType === 'delete' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    )}
                    {(activity.activityType === 'add' || activity.activityType === 'create') && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    )}
                  </div>
                  <div className="activity-content-seedp">
                    <div className="activity-title-seedp">{getActivityTitle(activity.activityType)}</div>
                    <div className="activity-description-seedp">{activity.description || 'Không có mô tả'}</div>
                  </div>
                  <div className="activity-date-seedp">{formatActivityDate(activity.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && validActivityHistory.length > 0 && (
            <div className="pagination-seedp">
              <button 
                className="pagination-button-seedp" 
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                « 
              </button>
              <div className="pagination-info-seedp">
                Trang {currentPage} / {totalPages}
              </div>
              <button 
                className="pagination-button-seedp" 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
        </div>
        
        <div className="form-actions-seedp">
          <button type="button" className="btn-close-seedp" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeeDetailPage;