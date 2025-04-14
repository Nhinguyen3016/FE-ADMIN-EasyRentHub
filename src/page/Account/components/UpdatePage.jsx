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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        role: user.role || 'Quản trị viên',
        avatar: null
      });
      
      // If user has avatar url from API
      if (user.avatar) {
        setPreviewImage(user.avatar);
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Map the role from Vietnamese to English for API
      let apiRole;
      switch (userData.role) {
        case 'Quản trị viên':
          apiRole = 'Admin';
          break;
        case 'Chủ nhà':
          apiRole = 'Landlord';
          break;
        case 'Người thuê':
          apiRole = 'Tenant';
          break;
        default:
          apiRole = 'Tenant';
      }

      // Prepare request data
      const requestData = {
        role: apiRole
      };

      console.log(`Sending update request to: http://localhost:5000/api/user/${user.id}`);
      console.log('Request payload:', requestData);

      // Make API call to update user role
      const response = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          // If it's JSON, parse it
          const errorData = await response.json();
          errorMessage = errorData.message || `Lỗi: ${response.status} ${response.statusText}`;
        } else {
          // If not JSON (like HTML error page), use status code info
          errorMessage = `Lỗi máy chủ: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Parse response as JSON
      const responseData = await response.json();
      console.log('Update successful, response:', responseData);

      // Call the onUpdate function from parent component to update UI
      onUpdate({
        ...userData,
        // We keep the original ID and other data
        id: user.id
      });
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating user:', err);
      
      // Determine what error message to show to the user
      const errorMessage = err.message || 'Đã xảy ra lỗi khi cập nhật người dùng';
      
      // If error contains "<!DOCTYPE", it's likely a CORS or server error
      if (errorMessage.includes('<!DOCTYPE') || errorMessage.includes('Unexpected token')) {
        setError('Lỗi kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên.');
      } else {
        setError(errorMessage);
      }
      
      setIsSubmitting(false);
    }
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
        <div className="update-page-header-udt">
          <h1 className="update-page-title-udt">Chỉnh sửa tài khoản</h1>
        </div>
        
        <div className="update-form-container-udt">
          <div className="avatar-section-udt">
            <div className="avatar-container-udt">
              <img 
                src={previewImage || (user && user.avatar) || avatar} 
                alt="Ảnh đại diện" 
                className="avatar-preview-udt" 
              />
              <div className="avatar-upload-btn-udt">
                <label htmlFor="avatar" className="custom-file-upload-udt">
                  <i className="upload-icon-udt"></i>
                  Tải lên ảnh mới
                </label>
                <input 
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="avatar-input-udt"
                />
              </div>
              <span className="avatar-label-udt">Ảnh đại diện</span>
            </div>
          </div>
          
          <form className="update-form-udt" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message-udt" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <div className="form-group-udt">
              <label className="form-label-udt" htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Nguyễn Thị Tố Nhi"
                className={`form-input-udt ${focusedField === 'name' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('name')}
                onBlur={handleBlur}
                disabled
              />
            </div>
            
            <div className="form-group-udt">
              <label className="form-label-udt" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="tonhi3016@gmail.com"
                className={`form-input-udt ${focusedField === 'email' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                disabled
              />
            </div>
            
            <div className="form-group-udt">
              <label className="form-label-udt" htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Quế Sơn, Quảng Nam"
                className={`form-input-udt ${focusedField === 'address' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('address')}
                onBlur={handleBlur}
                disabled
              />
            </div>
            
            <div className="form-group-udt">
              <label className="form-label-udt" htmlFor="role">Vai trò</label>
              <select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                className={`form-select-udt ${focusedField === 'role' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('role')}
                onBlur={handleBlur}
              >
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Chủ nhà">Chủ nhà</option>
                <option value="Người thuê">Người thuê</option>
              </select>
            </div>
            
            <div className="form-actions-udt">
              <button 
                type="button" 
                className="btn-cancel-udt" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Đóng
              </button>
              <button 
                type="submit" 
                className="btn-update-udt"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;