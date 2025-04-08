import React, { useState, useEffect } from 'react';
import '../../../styles/Account/components/SeeDetailPage.css';
import avatar from '../../../images/loopy1.jpg';

const SeeDetailPage = ({ user, onClose }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    avatar: null
  });
  
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        role: user.role || 'Admin',
        avatar: null
      });
    }
  }, [user]);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="detail-page-container-seedp">
      <div className="detail-page-content-seedp">
        <h1 className="detail-page-title-seedp">Chi tiết tài khoản</h1>
        
        <div className="detail-form-container-seedp">
          <div className="avatar-section-seedp">
            <div className="avatar-container-seedp">
              <img 
                src={avatar} 
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
              <label className="form-label-seedp">{userData.name || "Nguyễn Thị Tố Nhi"}</label>
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
              <label className="form-label-seedp">{userData.email || "tonhi3016@gmail.com"}</label>
            </div>
            
            <div className="form-group-seedp">
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address}
                placeholder="Địa chỉ"
                className={`form-input-seedp ${focusedField === 'address' ? 'focused-seedp' : ''}`}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-seedp">{userData.address || "Quế Sơn,Quảng Nam"}</label>
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
                <option value="Admin">Admin</option>
                <option value="Chủ nhà">Chủ nhà</option>
                <option value="Người thuê">Người thuê</option>
              </select>
              <label className="form-label-seedp">Role</label>
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