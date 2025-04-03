import React, { useState } from 'react';
import '../../styles/login/Login.css';
import googleLogo from '../../images/google.png';
import facebookLogo from '../../images/facebook.png';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', { username, password });
        // Add actual login logic here
    };
    return (
        <div className="login-container">
            <div className="login-illustration">
                <div className="city-illustration">
                    {/* City illustration from the image */}
                </div>
            </div>

            <h1 className="login-title">Đăng nhập</h1>

            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="login-input"
                    placeholder="Tên"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="login-input"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="password-options">
                    <button
                        type="button"
                        className="forgot-password"
                        onClick={() => console.log('Forgot password clicked')}
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
            </form>



            <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-text">OR</span>
                <span className="divider-line"></span>
            </div>

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
                <a href="#register" className="signup-link">Đăng ký</a>
            </div>
        </div>
    );
};

export default Login;