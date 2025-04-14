import React, { useState } from 'react';
import '../../../styles/Account/components/AddAccountPage.css';
import defaultAvatar from '../../../images/loopy1.jpg';

const AddAccountPage = ({ onClose, onAdd }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    role: 'Người thuê',
    password: '',
    confirmPassword: '',
    avatar: null,
    mobile: '' // Thêm trường mobile
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) newErrors.name = "Họ và tên không được để trống";
    
    // Email validation
    if (!userData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!userData.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    
    // Password validation
    if (!userData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (userData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Map role từ tiếng Việt sang tiếng Anh để phù hợp với API
  const mapRole = (vietnameseRole) => {
    const roleMapping = {
      'Quản trị viên': 'Admin',
      'Chủ nhà': 'Landlord',
      'Người thuê': 'Tenant'
    };
    return roleMapping[vietnameseRole] || 'Tenant';
  };

  // Chuyển đổi dữ liệu form để phù hợp với API
  const prepareDataForApi = () => {
    // Giả sử địa chỉ được nhập theo định dạng "đường, phường, thành phố, quốc gia"
    const addressParts = userData.address.split(',').map(part => part.trim());
    
    return {
      full_name: userData.name,
      email: userData.email,
      password: userData.password,
      mobile: userData.mobile || '',
      role: mapRole(userData.role),
      // Xử lý avatar: trong thực tế bạn sẽ cần upload file lên server riêng và lấy URL
      // Ở đây chỉ mô phỏng với URL mặc định
      avatar: previewImage || "https://res.cloudinary.com/dw1sniewf/image/upload/v1669720008/noko-social/audefto1as6m8gg17nu1.jpg",
      address: {
        name: addressParts[0] || '',
        road: addressParts[0] || '',
        quarter: addressParts[1] || '',
        city: addressParts[2] || '',
        country: addressParts[3] || 'Việt Nam',
        lat: "",
        lng: ""
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitMessage({ type: '', text: '' });
      
      try {
        const apiData = prepareDataForApi();
        
        // Lấy token từ localStorage hoặc context state
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Cần token để xác thực quyền Admin
          },
          body: JSON.stringify(apiData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.title || 'Có lỗi xảy ra khi tạo tài khoản');
        }
        
        setSubmitMessage({
          type: 'success',
          text: 'Tài khoản đã được tạo thành công!'
        });
        
        // Gọi callback onAdd nếu có
        if (onAdd) {
          onAdd(data.user);
        }
        
        // Reset form sau khi submit thành công
        setTimeout(() => {
          setUserData({
            name: '',
            email: '',
            address: '',
            role: 'Người thuê',
            password: '',
            confirmPassword: '',
            avatar: null,
            mobile: ''
          });
          setPreviewImage(null);
        }, 2000);
        
      } catch (error) {
        console.error('Error creating account:', error);
        setSubmitMessage({
          type: 'error',
          text: error.message || 'Có lỗi xảy ra khi tạo tài khoản'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <div className="add-account-page-container">
      <div className="add-account-page-content">
        <h1 className="add-account-page-title">Thêm tài khoản mới</h1>
        
        {submitMessage.text && (
          <div className={`submit-message ${submitMessage.type}`}>
            {submitMessage.text}
          </div>
        )}
        
        <div className="add-form-container">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={previewImage || defaultAvatar} 
                alt="Ảnh đại diện" 
                className="avatar-preview" 
              />
              <label htmlFor="avatar-input" className="avatar-upload-label">
                Chọn ảnh
                <input 
                  type="file"
                  id="avatar-input"
                  name="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="avatar-input"
                />
              </label>
              <span className="avatar-label">Ảnh đại diện</span>
            </div>
          </div>
          
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Họ và tên"
                className={`form-input ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'error' : ''}`}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
              />
              <label className="form-label">Họ và tên</label>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`form-input ${focusedField === 'email' ? 'focused' : ''} ${errors.email ? 'error' : ''}`}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
              />
              <label className="form-label">Email</label>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className={`form-input ${focusedField === 'mobile' ? 'focused' : ''}`}
                onFocus={() => handleFocus('mobile')}
                onBlur={handleBlur}
              />
              <label className="form-label">Số điện thoại</label>
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                className={`form-input ${focusedField === 'address' ? 'focused' : ''} ${errors.address ? 'error' : ''}`}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
              />
              <label className="form-label">Địa chỉ (đường, phường, thành phố, quốc gia)</label>
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-group">
              <select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                className={`form-select ${focusedField === 'role' ? 'focused' : ''}`}
                onFocus={() => handleFocus('role')}
                onBlur={handleBlur}
              >
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Chủ nhà">Chủ nhà</option>
                <option value="Người thuê">Người thuê</option>
              </select>
              <label className="form-label">Vai trò</label>
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className={`form-input ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}
                onFocus={() => handleFocus('password')}
                onBlur={handleBlur}
              />
              <label className="form-label">Mật khẩu</label>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                className={`form-input ${focusedField === 'confirmPassword' ? 'focused' : ''} ${errors.confirmPassword ? 'error' : ''}`}
                onFocus={() => handleFocus('confirmPassword')}
                onBlur={handleBlur}
              />
              <label className="form-label">Xác nhận mật khẩu</label>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="btn-add"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Thêm tài khoản'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAccountPage;