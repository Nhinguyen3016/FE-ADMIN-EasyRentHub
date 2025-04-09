import React, { useState } from 'react';
import '../../../styles/notification/messageManagement/MessageManagement.css';
import MessageDialog from '../messageDialog/MessageDialog';
import avatar1 from '../../../images/avatar1.jpg';
import avatar2 from '../../../images/avatar2.jpg';
import avatar3 from '../../../images/avatar3.webp';
import avatar4 from '../../../images/avatar4.jpg';
import avatar5 from '../../../images/avatar5.jpg';
import avatar6 from '../../../images/avatar6.jpg';

const MessageManagement = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  
  const messages = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      message: 'Xin chào, tôi quan tâm đến căn hộ của bạn.',
      time: '2 giờ trước',
      avatar: avatar1
    },
    {
      id: 2,
      name: 'Trần Thị Hoa',
      message: 'Căn hộ này còn sẵn không bạn?',
      time: '1 ngày trước',
      avatar: avatar6
    },
    {
      id: 3,
      name: 'Lê Minh Phúc',
      message: 'Giá thuê có bao gồm phí dịch vụ không?',
      time: '3 ngày trước',
      avatar: avatar2
    },
    {
      id: 4,
      name: 'Phạm Văn Dũng',
      message: 'Tôi muốn xem nhà vào cuối tuần này.',
      time: '5 ngày trước',
      avatar: avatar3
    },
    {
      id: 5,
      name: 'Nguyễn Hà Bảo Ngọc',
      message: 'Tôi muốn xem nhà vào cuối tuần này.',
      time: '5 ngày trước',
      avatar: avatar5
    },
    {
      id: 6,
      name: 'Nguyễn Tường Vy ',
      message: 'Tôi muốn xem nhà vào cuối tuần này.',
      time: '5 ngày trước',
      avatar: avatar4
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
                name: message.name,
                avatar: message.avatar
              })}
            >
              <div className="avatar-mssm">
                <img src={message.avatar} alt={`Avatar của ${message.name}`} className="avatar-image-mssm" />
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