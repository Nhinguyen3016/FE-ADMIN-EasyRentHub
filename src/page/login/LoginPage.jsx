import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login/Login.css';
import googleLogo from '../../images/google.png';
import facebookLogo from '../../images/facebook.png';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!username.trim()) validationErrors.username = 'Tên không được để trống';
    if (!password.trim()) validationErrors.password = 'Mật khẩu không được để trống';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Login attempt with:', { username, password });
    navigate('/dashboard');
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);

    // Xóa lỗi ngay khi người dùng nhập
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <div className="city-illustration"></div>
      </div>

      <div className="login-box">
        {isForgotPassword ? (
          <ForgotPasswordPage onBack={() => setIsForgotPassword(false)} />
        ) : (
          <>
            <h1 className="login-title">Đăng nhập</h1>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="login-input"
                placeholder="Tên"
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
              {errors.username && <p className="input-error">{errors.username}</p>}

              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              {errors.password && <p className="input-error">{errors.password}</p>}

              <div className="password-options">
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Quên mật khẩu
                </button>
                <label className="show-password">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Hiển thị mật khẩu
                </label>
              </div>

              <button type="submit" className="login-button">
                Đăng nhập
              </button>

              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">OR</span>
                <span className="divider-line"></span>
              </div>
            </form>

            <div className="social-login">
              <button className="social-button google">
                <img src={googleLogo} alt="Google" className="social-icon" />
              </button>
              <button className="social-button facebook">
                <img src={facebookLogo} alt="Facebook" className="social-icon" />
              </button>
            </div>

            <div className="signup-prompt">
              <span>Chưa có tài khoản? </span>
              <a href="/register" className="signup-link">Đăng ký</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
