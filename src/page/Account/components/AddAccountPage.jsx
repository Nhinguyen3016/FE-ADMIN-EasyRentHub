import React, { useState } from 'react';
import '../../../styles/Account/components/AddAccountPage.css';
import defaultAvatar from '../../../images/loopy1.jpg';

const AddAccountPage = ({ onClose, onAdd }) => {
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Tenant',
    avatar: '',
    mobile: '',
    address: {
      name: '',
      road: '',
      quarter: '',
      city: '',
      country: 'Việt Nam',
      lat: '',
      lng: ''
    }
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const containsInjection = (value) => {
    if (!value || typeof value !== 'string') return false;
    
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
    if (!email || typeof email !== 'string') {
      return { valid: false, error: 'Email không được để trống' };
    }

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
      return;
    }
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value || ''
        }
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value || ''
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
    if (userData.email && userData.email.trim()) {
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
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        // Set avatar URL - you might want to upload to cloud storage first
        setUserData(prev => ({
          ...prev,
          avatar: "https://res.cloudinary.com/dw1sniewf/image/upload/v1669720008/noko-social/audefto1as6m8gg17nu1.jpg"
        }));
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
    
    // Check for injections in basic fields
    for (const [key, value] of Object.entries(userData)) {
      if (value && typeof value === 'string' && containsInjection(value)) {
        newErrors[key] = "Nội dung không hợp lệ hoặc có thể gây nguy hiểm cho hệ thống";
      }
    }
    
    // Check for injections in address fields
    if (userData.address) {
      for (const [key, value] of Object.entries(userData.address)) {
        if (value && typeof value === 'string' && containsInjection(value)) {
          newErrors[`address.${key}`] = "Nội dung không hợp lệ hoặc có thể gây nguy hiểm cho hệ thống";
        }
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    // Validate required fields
    if (!userData.full_name || !userData.full_name.trim()) {
      newErrors.full_name = "Họ và tên không được để trống";
    } else if (userData.full_name.trim().length > 25) {
      newErrors.full_name = "Họ và tên không được vượt quá 25 ký tự";
    }
    
    if (!userData.email || !userData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else {
      const emailValidation = validateEmail(userData.email);
      if (!emailValidation.valid) {
        newErrors.email = emailValidation.error;
      }
    }
    
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

  // Prepare JSON data for API - FIXED VERSION
  const prepareDataForApi = () => {
    const apiData = {
      full_name: (userData.full_name || '').trim(),
      email: (userData.email || '').trim().toLowerCase(),
      password: userData.password || '',
      role: userData.role || 'Tenant',
      mobile: (userData.mobile || '').trim(),
      avatar: userData.avatar || undefined // Let backend use default if empty
    };

    // Only include address if at least one required field is filled
    const addressData = {
      name: (userData.address?.name || '').trim(),
      road: (userData.address?.road || '').trim(),
      quarter: (userData.address?.quarter || '').trim(),
      city: (userData.address?.city || '').trim(),
      country: (userData.address?.country || 'Việt Nam').trim(),
      lat: (userData.address?.lat || '').trim(),
      lng: (userData.address?.lng || '').trim()
    };

    // Check if any address field has meaningful data
    const hasAddressData = Object.values(addressData).some(value => value && value !== 'Việt Nam');
    
    if (hasAddressData) {
      apiData.address = addressData;
    }
    
    console.log('JSON data being sent:', JSON.stringify(apiData, null, 2));
    
    return apiData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for injections in all form data
    const hasInjection = Object.entries(userData).some(([key, value]) => {
      if (key === 'address' && userData.address) {
        return Object.values(userData.address).some(addrValue => 
          addrValue && typeof addrValue === 'string' && containsInjection(addrValue)
        );
      }
      return value && typeof value === 'string' && containsInjection(value);
    });
    
    if (hasInjection) {
      setSubmitMessage({
        type: 'error',
        text: 'Tạo tài khoản thất bại. Dữ liệu nhập vào không hợp lệ hoặc có thể gây nguy hiểm cho hệ thống.'
      });
      return;
    }
    
    // Validate email before submission
    if (userData.email && userData.email.trim()) {
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
        const jsonData = prepareDataForApi();
        const token = localStorage.getItem('token');
        
        console.log('Sending request to API...', jsonData);
        
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jsonData)
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          // Handle different error scenarios from backend
          let errorMessage = 'Có lỗi xảy ra khi tạo tài khoản';
          
          if (data.title === "Email already in use") {
            errorMessage = 'Email này đã được sử dụng';
          } else if (data.title === "Missing required fields") {
            errorMessage = 'Thiếu thông tin bắt buộc';
          } else if (data.title === "Invalid email format") {
            errorMessage = 'Email không đúng định dạng';
          } else if (data.title === "Invalid role") {
            errorMessage = 'Vai trò không hợp lệ';
          } else if (data.title === "Insufficient permissions") {
            errorMessage = 'Bạn không có quyền thực hiện thao tác này';
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.msg) {
            errorMessage = data.msg;
          }
          
          throw new Error(errorMessage);
        }
        
        setSubmitMessage({
          type: 'success',
          text: 'Tài khoản đã được tạo thành công!'
        });
        
        // Call parent callback with new user data
        if (onAdd && data.user) {
          onAdd(data.user);
        }
        
        // Reset form after successful submission
        setTimeout(() => {
          setUserData({
            full_name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Tenant',
            avatar: '',
            mobile: '',
            address: {
              name: '',
              road: '',
              quarter: '',
              city: '',
              country: 'Việt Nam',
              lat: '',
              lng: ''
            }
          });
          setPreviewImage(null);
          setErrors({});
          setSubmitMessage({ type: '', text: '' });
          
          // Optionally close the modal after success
          if (onClose) {
            setTimeout(() => onClose(), 1000);
          }
        }, 2000);
        
      } catch (error) {
        console.error('Error creating account:', error);
        setSubmitMessage({
          type: 'error',
          text: error.message || 'Tạo tài khoản thất bại. Vui lòng thử lại.'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Handle form validation errors
      const firstError = Object.values(errors)[0];
      setSubmitMessage({
        type: 'error',
        text: firstError || 'Vui lòng kiểm tra lại thông tin nhập vào.'
      });
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
                id="full_name"
                name="full_name"
                value={userData.full_name || ''}
                onChange={handleChange}
                placeholder="Họ và tên"
                maxLength="25"
                className={`form-input ${focusedField === 'full_name' ? 'focused' : ''} ${errors.full_name ? 'error' : ''}`}
                onFocus={() => handleFocus('full_name')}
                onBlur={handleBlur}
              />
              <label className="form-label">Họ và tên (tối đa 25 ký tự)</label>
              {errors.full_name && <span className="error-message">{errors.full_name}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email || ''}
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
                value={userData.mobile || ''}
                onChange={handleChange}
                placeholder="Số điện thoại"
                className={`form-input ${focusedField === 'mobile' ? 'focused' : ''} ${errors.mobile ? 'error' : ''}`}
                onFocus={() => handleFocus('mobile')}
                onBlur={handleBlur}
              />
              <label className="form-label">Số điện thoại (tùy chọn)</label>
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
            </div>
            
            {/* Address fields */}
            <div className="form-group">
              <input
                type="text"
                id="address_name"
                name="address.name"
                value={userData.address?.name || ''}
                onChange={handleChange}
                placeholder="Tên địa chỉ"
                className={`form-input ${focusedField === 'address.name' ? 'focused' : ''} ${errors['address.name'] ? 'error' : ''}`}
                onFocus={() => handleFocus('address.name')}
                onBlur={handleBlur}
              />
              <label className="form-label">Tên địa chỉ (tùy chọn)</label>
              {errors['address.name'] && <span className="error-message">{errors['address.name']}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="address_road"
                name="address.road"
                value={userData.address?.road || ''}
                onChange={handleChange}
                placeholder="Đường"
                className={`form-input ${focusedField === 'address.road' ? 'focused' : ''} ${errors['address.road'] ? 'error' : ''}`}
                onFocus={() => handleFocus('address.road')}
                onBlur={handleBlur}
              />
              <label className="form-label">Đường (tùy chọn)</label>
              {errors['address.road'] && <span className="error-message">{errors['address.road']}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="address_quarter"
                name="address.quarter"
                value={userData.address?.quarter || ''}
                onChange={handleChange}
                placeholder="Phường/Xã"
                className={`form-input ${focusedField === 'address.quarter' ? 'focused' : ''} ${errors['address.quarter'] ? 'error' : ''}`}
                onFocus={() => handleFocus('address.quarter')}
                onBlur={handleBlur}
              />
              <label className="form-label">Phường/Xã (tùy chọn)</label>
              {errors['address.quarter'] && <span className="error-message">{errors['address.quarter']}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="address_city"
                name="address.city"
                value={userData.address?.city || ''}
                onChange={handleChange}
                placeholder="Quận/Huyện"
                className={`form-input ${focusedField === 'address.city' ? 'focused' : ''} ${errors['address.city'] ? 'error' : ''}`}
                onFocus={() => handleFocus('address.city')}
                onBlur={handleBlur}
              />
              <label className="form-label">Quận/Huyện (tùy chọn)</label>
              {errors['address.city'] && <span className="error-message">{errors['address.city']}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="address_country"
                name="address.country"
                value={userData.address?.country || ''}
                onChange={handleChange}
                placeholder="Quốc gia"
                className={`form-input ${focusedField === 'address.country' ? 'focused' : ''} ${errors['address.country'] ? 'error' : ''}`}
                onFocus={() => handleFocus('address.country')}
                onBlur={handleBlur}
              />
              <label className="form-label">Quốc gia</label>
              {errors['address.country'] && <span className="error-message">{errors['address.country']}</span>}
            </div>
            
            <div className="form-group">
              <select
                id="role"
                name="role"
                value={userData.role || 'Tenant'}
                onChange={handleChange}
                className={`form-select ${focusedField === 'role' ? 'focused' : ''}`}
                onFocus={() => handleFocus('role')}
                onBlur={handleBlur}
              >
                <option value="Admin">Quản trị viên</option>
                <option value="Landlord">Chủ nhà</option>
                <option value="Tenant">Người thuê</option>
              </select>
              <label className="form-label">Vai trò</label>
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={userData.password || ''}
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
                value={userData.confirmPassword || ''}
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