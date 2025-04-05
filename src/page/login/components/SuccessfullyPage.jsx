import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../../../styles/login/component/SuccessfullyPage.css';

const SuccessfullyPage = () => {
    const handleRedirectToLogin = () => {
        // This will reload the page and redirect to /login
        window.location.href = '/'; // Redirect to the login page
    };

    return (
        <div className="password-update-message-ssl">
            <FaCheckCircle className="password-update-icon-ssl" />
            <h5>Đã cập nhật mật khẩu thành công!</h5>
            <button className="login-redirect-button" onClick={handleRedirectToLogin}>
                Đăng nhập ngay
            </button>
        </div>
    );
};

export default SuccessfullyPage;
