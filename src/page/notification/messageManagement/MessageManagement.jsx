import React, { useState } from 'react';
import '../../../styles/notification/messageManagement/MessageManagement.css';
import MessageDialog from '../messageDialog/MessageDialog';

const MessageManagement = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  
  const messages = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      message: 'Xin chào, tôi quan tâm đến căn hộ của bạn.',
      time: '2 giờ trước'
    },
    {
      id: 2,
      name: 'Trần Thị Hoa',
      message: 'Căn hộ này còn sẵn không bạn?',
      time: '1 ngày trước'
    },
    {
      id: 3,
      name: 'Lê Minh Phúc',
      message: 'Giá thuê có bao gồm phí dịch vụ không?',
      time: '3 ngày trước'
    },
    {
      id: 4,
      name: 'Phạm Văn Dũng',
      message: 'Tôi muốn xem nhà vào cuối tuần này.',
      time: '5 ngày trước'
    }
  ];
  
  const handleMessageClick = (contact) => {
    setSelectedContact(contact);
  };
  
  const handleCloseDialog = () => {
    setSelectedContact(null);
  };
  
  return (
    <div className={`message-management-container ${selectedContact ? 'chat-open' : ''}`}>
      <div className="message-management-mssm">
        <h1 className="header-mssm">Quản lý tin nhắn</h1>
        <div className="divider-mssm"></div>
        
        <div className="message-list-mssm">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`message-item-mssm ${selectedContact && selectedContact.id === message.id ? 'active' : ''}`}
              onClick={() => handleMessageClick({
                id: message.id,
                name: message.name
              })}
            >
              <div className="avatar-mssm">
                <div className="avatar-circle-mssm"></div>
              </div>
              <div className="message-content-mssm">
                <div className="message-header-mssm">
                  <span className="sender-name-mssm">{message.name}</span>
                  <span className="message-time-mssm">{message.time}</span>
                </div>
                <p className="message-text-mssm">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedContact && (
        <div className="chat-sidebar">
          <MessageDialog
            onClose={handleCloseDialog}
            contact={selectedContact}
          />
        </div>
      )}
    </div>
  );
};

export default MessageManagement;