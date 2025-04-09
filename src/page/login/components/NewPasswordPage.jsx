import React, { useState } from 'react';
import '../../../styles/login/component/NewPasswordPage.css';
import { FaArrowLeft } from 'react-icons/fa';
import SuccessfullyPage from './SuccessfullyPage';

const NewPasswordPage = ({ onBack }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChangePassword = () => {
        if (newPassword.trim() === '' || confirmPassword.trim() === '') {
            setErrorMessage('Vui lòng nhập đầy đủ mật khẩu.');
        } else if (newPassword !== confirmPassword) {
            setErrorMessage('Mật khẩu không khớp!');
        } else {
            setErrorMessage('');
            setIsSuccess(true);
            console.log('Password updated successfully');
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage(''); // Ẩn lỗi khi nhập lại
    };

    return (
        <div className="new-password-container-nps">
            {isSuccess ? (
                <SuccessfullyPage />
            ) : (
                <>
                    <h1>Nhập Mật Khẩu Mới</h1>

                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={handleInputChange(setNewPassword)}
                            className="input-password-nps"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword)}
                            className="input-password-nps"
                        />
                        {errorMessage && <p className="input-error">{errorMessage}</p>}
                    </div>

                    <button onClick={handleChangePassword} className="button-submit-nps">
                        Xác Nhận
                    </button>
                </>
            )}

            {!isSuccess && (
                <button className="back-to-login-fgp" onClick={onBack}>
                    <FaArrowLeft className="icon-back-fgp" /> Quay lại
                </button>
            )}
        </div>
    );
};

export default NewPasswordPage;
