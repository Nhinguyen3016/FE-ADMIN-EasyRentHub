import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import OTPPage from './OTPPage';
import '../../../styles/login/component/ForgotPasswordPage.css';

const ForgotPasswordPage = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showOTP, setShowOTP] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setEmailError('Email không hợp lệ');
            return;
        }

        setEmailError('');
        console.log('Gửi yêu cầu reset mật khẩu:', email);
        setShowOTP(true);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError(''); // Xóa lỗi khi bắt đầu nhập
    };

    return (
        <div className="login-container-fgp">
            {showOTP ? (
                <OTPPage onBack={() => setShowOTP(false)} />
            ) : (
                <>
                    <h1 className="login-title-fgp">Quên mật khẩu</h1>
                    <form className="login-form-fgp" onSubmit={handleForgotPassword}>
                        <input
                            type="email"
                            className="login-input-fgp"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {emailError && <p className="input-error">{emailError}</p>}

                        <button type="submit" className="login-button-fgp">
                            Gửi yêu cầu
                        </button>
                    </form>
                    <button className="back-to-login-fgp" onClick={onBack}>
                        <FaArrowLeft className="icon-back-fgp" /> Quay lại
                    </button>
                </>
            )}
        </div>
    );
};

export default ForgotPasswordPage;
