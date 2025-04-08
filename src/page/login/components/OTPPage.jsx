import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import '../../../styles/login/component/OTPPage.css';
import NewPasswordPage from './NewPasswordPage'; 

const OTPPage = ({ onBack }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleSubmit = () => {
        setOtpVerified(true); 
    };

    return (
        <div className="otp-container">
            {otpVerified ? (
                <NewPasswordPage onBack={() => setOtpVerified(false)} />
            ) : (
                <>
                    <h1 className="otp-title">Nhập OTP</h1>
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="otp-box"
                            />
                        ))}
                    </div>
                    <button className="otp-submit" onClick={handleSubmit}>
                        Xác nhận
                    </button>
                    <button className="back-to-login-fgp" onClick={onBack}>
                        <FaArrowLeft className="icon-back-fgp" /> Quay lại
                    </button>
                </>
            )}
        </div>
    );
};

export default OTPPage;
