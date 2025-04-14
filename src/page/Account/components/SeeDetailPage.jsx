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
    }
  }, [user]);

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

  // Format the address from object to string for display
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
              <img 
                src={userData.avatar || avatar} 
                alt="Ảnh đại diện" 
                className="avatar-preview-seedp" 
              />
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
            
            <div className="form-actions-seedp">
              <button type="button" className="btn-close-seedp" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeDetailPage;