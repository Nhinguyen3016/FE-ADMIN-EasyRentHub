import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/register/RegisterPage.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Xóa lỗi khi bắt đầu nhập
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên không được để trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    if (!formData.role) newErrors.role = 'Vui lòng chọn vai trò';
    if (!formData.password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Mật khẩu không khớp';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Form submitted:', formData);
    // Gửi dữ liệu đăng ký đến server tại đây nếu cần
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="registration-container-rg">
      <div className="back-button-rg">
        <button onClick={goBack}>&#60;</button>
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
            />
            {errors.name && <p className="input-error">{errors.name}</p>}
          </div>

          <div className="form-group-rg">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>

          <div className="form-group-rg">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>Vai trò</option>
              <option value="user">Tenant</option>
              <option value="manager">Landlord</option>
            </select>
            <div className="select-arrow-rg">&#9662;</div>
            {errors.role && <p className="input-error">{errors.role}</p>}
          </div>

          <div className="form-group-rg">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>

          <div className="form-group-rg">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="input-error">{errors.confirmPassword}</p>}
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
