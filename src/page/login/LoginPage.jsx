import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login/Login.css';
import googleLogo from '../../images/google.png';
import facebookLogo from '../../images/facebook.png';
import ForgotPasswordPage from './components/ForgotPasswordPage';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('refreshToken');
  }, []);

  const saveUserData = (data) => {
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role) {
        localStorage.setItem('userRole', data.user.role);
      }
    }
    
    if (data.expiresIn) {
      const expirationTime = new Date().getTime() + data.expiresIn * 1000;
      localStorage.setItem('tokenExpiration', expirationTime);
    }
    
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!email.trim()) validationErrors.email = 'Email không được để trống';
    if (!password.trim()) validationErrors.password = 'Mật khẩu không được để trống';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập không thành công');
      }

      console.log('Đăng nhập thành công:', data);
      
      if (data.user && data.user.role === 'Admin') {
        saveUserData(data);
        navigate('/dashboard');
      } else {
        setErrors({
          submit: 'Bạn không có quyền truy cập vào hệ thống quản trị. Chỉ tài khoản Admin mới có thể đăng nhập.'
        });
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setErrors({ 
        submit: error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng kiểm tra email và mật khẩu.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

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
                type="email"
                className="login-input"
                placeholder="Email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && <p className="input-error">{errors.email}</p>}

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
              {errors.submit && <p className="input-error">{errors.submit}</p>}

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

              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
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