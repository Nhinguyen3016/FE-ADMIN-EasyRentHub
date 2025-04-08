import React, { useState, useEffect } from 'react';
import '../../../styles/Account/components/UpdatePage.css';
import avatar from '../../../images/loopy1.jpg';

const UpdatePage = ({ user, onClose, onUpdate }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    avatar: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({
        ...prev,
        avatar: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(userData);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="update-page-container-udt">
      <div className="update-page-content-udt">
        <h1 className="update-page-title-udt">Chỉnh sửa tài khoản</h1>
        
        <div className="update-form-container-udt">
          <div className="avatar-section-udt">
            <div className="avatar-container-udt">
              <img 
                src={previewImage || avatar} 
                alt="Ảnh đại diện" 
                className="avatar-preview-udt" 
              />
              <span className="avatar-label-udt">Ảnh đại diện</span>
            </div>
          </div>
          
          <form className="update-form-udt" onSubmit={handleSubmit}>
            <div className="form-group-udt">
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Họ và tên"
                className={`form-input-udt ${focusedField === 'name' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-udt">{userData.name || "Nguyễn Thị Tố Nhi"}</label>
            </div>
            
            <div className="form-group-udt">
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`form-input-udt ${focusedField === 'email' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-udt">{userData.email || "tonhi3016@gmail.com"}</label>
            </div>
            
            <div className="form-group-udt">
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className={`form-input-udt ${focusedField === 'address' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                disabled
              />
              <label className="form-label-udt">{userData.address || "Quế Sơn,Quảng Nam"}</label>
            </div>
            
            <div className="form-group-udt">
              <select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                className={`form-select-udt ${focusedField === 'role' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('role')}
                onBlur={handleBlur}
              >
                <option value="Admin">Admin</option>
                <option value="Chủ nhà">Chủ nhà</option>
                <option value="Người thuê">Người thuê</option>
              </select>
              <label className="form-label-udt">Role</label>
            </div>
            
            <div className="form-actions-udt">
              <button type="button" className="btn-cancel-udt" onClick={onClose}>
                Đóng
              </button>
              <button type="submit" className="btn-update-udt">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;