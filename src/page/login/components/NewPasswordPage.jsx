import React, { useState } from 'react';
import '../../../styles/login/component/NewPasswordPage.css';  
import { FaArrowLeft } from 'react-icons/fa';

const NewPasswordPage = ({ onBack }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            console.log('Password updated successfully');
        } else {
            alert('Mật khẩu không khớp!');
        }
    };

    return (
        <div className="new-password-container-nps">
            <h1>Nhập Mật Khẩu Mới</h1>
            <div>
                <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-password-nps"
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-password-nps"
                />
            </div>
            <button onClick={handleChangePassword} className="button-submit-nps">
                Xác Nhận
            </button>
            <button className="back-to-login-fgp" onClick={onBack}>
                <FaArrowLeft className="icon-back-fgp" /> Quay lại
            </button>
        </div>
    );
};

export default NewPasswordPage;
