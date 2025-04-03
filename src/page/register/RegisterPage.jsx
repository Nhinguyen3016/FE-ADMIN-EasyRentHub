import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/register/RegisterPage.css';

const RegistrationForm = () => {
  const navigate = useNavigate(); // Tạo instance của useNavigate
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  // Function để quay lại trang trước
  const goBack = () => {
    navigate(-1); // Điều hướng quay lại trang trước
  };

  return (
    <div className="registration-container-rg">
      <div className="back-button-rg">
        <button onClick={goBack}>&#60;</button> {/* Thêm sự kiện onClick để quay lại */}
      </div>
      
      <div className="form-container-rg">
        <h1 className="form-title-rg">Đăng ký</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group-rg">
            <input
              type="text"
              name="name"
              placeholder="Tên"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group-rg">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group-rg">
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group-rg">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>Vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">Tenant</option>
              <option value="manager">Landlord</option>
            </select>
            <div className="select-arrow-rg">&#9662;</div>
          </div>
          
          <div className="form-group-rg">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group-rg">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group-rg checkbox-group-rg">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Hiển thị mật khẩu</label>
          </div>
          
          <button type="submit" className="submit-button-rg">Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
