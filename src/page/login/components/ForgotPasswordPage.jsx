import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa'; 
import OTPPage from './OTPPage'; 
import '../../../styles/login/component/ForgotPasswordPage.css';

const ForgotPasswordPage = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [showOTP, setShowOTP] = useState(false); 

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Gửi yêu cầu reset mật khẩu:', email);
        setShowOTP(true); 
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
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
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
