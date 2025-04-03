import React, { useState } from 'react';
import '../../../styles/login/component/NewPasswordPage.css';  
import { FaArrowLeft } from 'react-icons/fa'; 
import SuccessfullyPage from './SuccessfullyPage'; // Import SuccessfullyPage here

const NewPasswordPage = ({ onBack }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSuccess, setIsSuccess] = useState(false); // Manage the success state

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            setIsSuccess(true); // Set success state to true to show the success page
            console.log('Password updated successfully');
        } else {
            alert('Mật khẩu không khớp!');
        }
    };

    return (
        <div className="new-password-container-nps">
            {isSuccess ? (
                // If password change is successful, show the SuccessfullyPage
                <SuccessfullyPage />
            ) : (
                // If not, show the password input form
                <>
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
                </>
            )}

            {/* Only render this button if the password update is not successful */}
            {!isSuccess && (
                <button className="back-to-login-fgp" onClick={onBack}>
                    <FaArrowLeft className="icon-back-fgp" /> Quay lại
                </button>
            )}
        </div>
    );
};

export default NewPasswordPage;
