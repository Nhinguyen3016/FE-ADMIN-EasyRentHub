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
    mobile: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const containsInjection = (value) => {
    if (typeof value !== 'string') return false;
    
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /alert\s*\(/i,
      /document\./i,
      /eval\s*\(/i
    ];
    
    const noSqlPatterns = [
      /\$gt:/i, 
      /\$lt:/i, 
      /\$ne:/i, 
      /\$eq:/i,
      /\$regex:/i,
      /\{\s*\$\w+:/i,
      /\[\s*\{\s*\$/i
    ];
    
    for (let pattern of [...xssPatterns, ...noSqlPatterns]) {
      if (pattern.test(value)) {
        return true;
      }
    }
    
    if (value.includes('$') && (value.includes('{') || value.includes('['))) {
      return true;
    }
    
    return false;
  };

  const validateEmail = (email) => {
    const basicEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!basicEmailRegex.test(email)) {
      return { valid: false, error: 'Email không đúng định dạng' };
    }

    if (email.toLowerCase().endsWith('@gmail.com')) {
      const username = email.split('@')[0];

      if (username.includes('..')) {
        return { valid: false, error: 'Email Gmail không được chứa dấu chấm liên tiếp' };
      }

      const validGmailChars = /^[a-zA-Z0-9]([a-zA-Z0-9._-]{0,28}[a-zA-Z0-9])?$/;
      if (!validGmailChars.test(username)) {
        return { valid: false, error: 'Email Gmail chỉ được chứa chữ cái, số, dấu chấm, dấu gạch dưới và dấu gạch ngang' };
      }
      
      const invalidSpecialChars = /[@#$%^&*()+={}\[\]|\\:;"'<>,?/]/;
      if (invalidSpecialChars.test(username)) {
        return { valid: false, error: 'Email Gmail không được chứa các ký tự đặc biệt' };
      }
      
      if (username.length < 6 || username.length > 30) {
        return { valid: false, error: 'Tên người dùng Gmail phải có độ dài từ 6 đến 30 ký tự' };
      }
    }
    
    return { valid: true, error: '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (containsInjection(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: "Nội dung không hợp lệ hoặc có thể gây nguy hiểm cho hệ thống"
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const handleEmailBlur = () => {
    if (userData.email.trim()) {
      const emailValidation = validateEmail(userData.email);
      if (!emailValidation.valid) {
        setErrors(prev => ({ ...prev, email: emailValidation.error }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          avatar: "Chỉ chấp nhận file hình ảnh"
        }));
        return;
      }
      
      setUserData(prev => ({
        ...prev,
        avatar: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: null
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    for (const [key, value] of Object.entries(userData)) {
      if (typeof value === 'string' && containsInjection(value)) {
        newErrors[key] = "Nội dung không hợp lệ hoặc có thể gây nguy hiểm cho hệ thống";
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    if (!userData.name.trim()) newErrors.name = "Họ và tên không được để trống";
    
    if (!userData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else {
      const emailValidation = validateEmail(userData.email);
      if (!emailValidation.valid) {
        newErrors.email = emailValidation.error;
      }
    }
    
    if (!userData.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    
    if (!userData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (userData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    
    if (userData.mobile && !/^[0-9]{10,11}$/.test(userData.mobile.replace(/\s/g, ''))) {
      newErrors.mobile = "Số điện thoại không hợp lệ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapRole = (vietnameseRole) => {
    const roleMapping = {
      'Quản trị viên': 'Admin',
      'Chủ nhà': 'Landlord',
      'Người thuê': 'Tenant'
    };
    return roleMapping[vietnameseRole] || 'Tenant';
  };

  const prepareDataForApi = () => {
    const addressParts = userData.address.split(',').map(part => part.trim());
    
    return {
      full_name: userData.name,
      email: userData.email,
      password: userData.password,
      mobile: userData.mobile || '',
      role: mapRole(userData.role),
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
    
    const hasInjection = Object.values(userData).some(value => 
      typeof value === 'string' && containsInjection(value)
    );
    
    if (hasInjection) {
      setSubmitMessage({
        type: 'error',
        text: 'Tạo tài khoản thất bại. Dữ liệu nhập vào không hợp lệ hoặc có thể gây nguy hiểm cho hệ thống.'
      });
      return;
    }
    
    if (userData.email.trim()) {
      const emailValidation = validateEmail(userData.email);
      if (!emailValidation.valid) {
        setErrors(prev => ({ ...prev, email: emailValidation.error }));
        setSubmitMessage({
          type: 'error',
          text: 'Tạo tài khoản thất bại. Email không hợp lệ: ' + emailValidation.error
        });
        return;
      }
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitMessage({ type: '', text: '' });
      
      try {
        const apiData = prepareDataForApi();
        
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
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
        
        if (onAdd) {
          onAdd(data.user);
        }
        
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
          text: 'Tạo tài khoản thất bại. ' + (error.message || 'Có lỗi xảy ra khi tạo tài khoản')
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (errors.email) {
        setSubmitMessage({
          type: 'error',
          text: 'Tạo tài khoản thất bại. Email không hợp lệ: ' + errors.email
        });
      } else {
        setSubmitMessage({
          type: 'error',
          text: 'Vui lòng kiểm tra lại thông tin nhập vào.'
        });
      }
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    if (name === 'email') {
      handleEmailBlur();
    }
    
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
              {errors.avatar && <span className="error-message">{errors.avatar}</span>}
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
              {!errors.email && userData.email && (
                <span className="input-hint">Vui lòng nhập email hợp lệ (ví dụ: username@gmail.com)</span>
              )}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className={`form-input ${focusedField === 'mobile' ? 'focused' : ''} ${errors.mobile ? 'error' : ''}`}
                onFocus={() => handleFocus('mobile')}
                onBlur={handleBlur}
              />
              <label className="form-label">Số điện thoại</label>
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
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