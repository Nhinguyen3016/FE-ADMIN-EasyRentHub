import React, { useState, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import '../../../styles/login/component/OTPPage.css';
import NewPasswordPage from './NewPasswordPage';

const OTPPage = ({ onBack }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [otpVerified, setOtpVerified] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Chỉ cho phép số
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        if (otp.some(d => d === '')) {
            setError('Vui lòng nhập đầy đủ mã OTP.');
            return;
        }

        const enteredOTP = otp.join('');
        console.log('OTP entered:', enteredOTP);

        // Xử lý xác thực OTP (mock thành công)
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
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="otp-box"
                            />
                        ))}
                    </div>
                    {error && <p className="otp-error">{error}</p>}

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
