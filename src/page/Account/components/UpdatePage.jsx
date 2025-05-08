import React, { useState, useEffect } from 'react';
import '../../../styles/Account/components/UpdatePage.css';
import avatar from '../../../images/loopy1.jpg';

const UpdatePage = ({ user, onClose, onUpdate }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    status: 1,
    avatar: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      console.log('DEBUG - User object received:', user);
      console.log('DEBUG - User originalData:', user.originalData);
      

      const originalStatus = user.originalData && user.originalData.status !== undefined 
        ? user.originalData.status 
        : (user.status !== undefined ? user.status : 1);
        
      console.log('DEBUG - Original status found:', originalStatus, typeof originalStatus);
   
      const processedStatus = originalStatus === 0 ? 0 : 1;
      
      console.log('DEBUG - Processed status value:', processedStatus);
      
      setUserData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        role: user.role || '',
        status: processedStatus,
        avatar: null
      });

      if (user.avatar) {
        setPreviewImage(user.avatar);
      }
    }
  }, [user]);

  useEffect(() => {
    console.log('DEBUG - Current userData state:', userData);
    console.log('DEBUG - Status in state:', userData.status, typeof userData.status);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (e) => {
    // Parse value to number (0 or 1)
    const numericValue = parseInt(e.target.value, 10);
    console.log('DEBUG - Status changed to:', numericValue);
    
    setUserData(prev => ({
      ...prev,
      status: numericValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const requestData = {
        status: userData.status
      };
      
      console.log('DEBUG - Submitting status update:', requestData);

      const response = await fetch(`http://localhost:5000/api/user-status/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        let errorMessage;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || `Lỗi: ${response.status} ${response.statusText}`;
        } else {
          errorMessage = `Lỗi máy chủ: ${response.status} ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('DEBUG - Status update successful, response:', responseData);

      onUpdate({
        ...userData,
        id: user.id
      });

      setIsSubmitting(false);
    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi cập nhật người dùng';
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
              <input
                type="text"
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                placeholder="User"
                className={`form-input-udt ${focusedField === 'role' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('role')}
                onBlur={handleBlur}
                disabled
              />
            </div>

            <div className="form-group-udt">
              <label className="form-label-udt" htmlFor="status">Trạng thái</label>
              <select
                id="status"
                name="status"
                value={userData.status}
                onChange={handleStatusChange}
                className={`form-select-udt ${focusedField === 'status' ? 'focused-udt' : ''}`}
                onFocus={() => handleFocus('status')}
                onBlur={handleBlur}
              >
                <option value={1}>Kích hoạt</option>
                <option value={0}>Khóa</option>
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