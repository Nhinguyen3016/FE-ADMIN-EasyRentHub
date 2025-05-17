import '../../../styles/notification/messageDialog/MessageDialog.css';
import React, { useState, useRef } from 'react';

const MessageDialog = ({ onClose, contact }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'admin', 
      text: 'Tôi đã cập nhật thông tin phòng nhưng vẫn chưa hiển thị trên trang chính, admin có thể kiểm tra giúp tôi không?',
      time: '14:35',
      read: true
    },
    {
      id: 2,
      sender: 'admin',
      text: 'Khi tôi thử thanh toán phí dịch vụ, hệ thống báo lỗi. Nhờ admin hỗ trợ xử lý giúp!',
      time: '14:37',
      read: true
    },
    {
      id: 4,
      sender: 'admin', 
      text: 'Tôi không nhận được thông báo khi có người thuê gửi yêu cầu. Có phải hệ thống đang gặp lỗi không?',
      time: '14:42',
      read: false
    },
    {
      id: 5,
      sender: 'user', 
      text: 'Chào bạn, chúng tôi sẽ kiểm tra hệ thống thông báo và phản hồi lại sớm nhất có thể.',
      time: '14:43',
      read: false
    },
    {
      id: 6,
      sender: 'admin', 
      text: 'Tôi liên tục bị đăng xuất khỏi hệ thống. Có phải có vấn đề về bảo mật hoặc đăng nhập không?',
      time: '14:45',
      read: false
    },
    {
      id: 7,
      sender: 'user',
      text: 'Cảm ơn bạn đã báo lỗi. Bạn vui lòng thử xóa cache trình duyệt hoặc gửi mã lỗi cụ thể để chúng tôi kiểm tra chi tiết hơn.',
      time: '14:46',
      read: false
    }
    
  ]);
  const [isTyping] = useState(true);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user', 
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu(!showAttachmentMenu);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      sendFileMessage(file);
      setShowAttachmentMenu(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      sendImageMessage(file);
      setShowAttachmentMenu(false);
    }
  };

  const sendFileMessage = (file) => {
    const fileUrl = URL.createObjectURL(file);
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user', 
      text: `Đã gửi file: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      attachment: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl
      }
    };
    
    setMessages([...messages, newMessage]);
  };

  const sendImageMessage = (file) => {
    const imageUrl = URL.createObjectURL(file);
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user', // Changed from 'user' to 'user' (admin sending the message)
      text: `Đã gửi hình ảnh: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      attachment: {
        name: file.name,
        type: 'image',
        size: file.size,
        url: imageUrl
      }
    };
    
    setMessages([...messages, newMessage]);
  };

  const openFileExplorer = (type) => {
    if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === 'document' && fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const handleAttachmentType = (type) => {
    switch (type) {
      case 'image':
        openFileExplorer('image');
        break;
      case 'document':
        openFileExplorer('document');
        break;
      default:
        openFileExplorer('document');
    }
  };

  const renderAttachmentContent = (attachment) => {
    if (attachment.type === 'image') {
      return (
        <div className="image-preview">
          <img src={attachment.url} alt={attachment.name} />
          <div className="attachment-info">
            <span className="attachment-name">{attachment.name}</span>
            <span className="attachment-size">({(attachment.size / 1024).toFixed(1)} KB)</span>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <span className="attachment-icon">📎</span>
          <span className="attachment-name">{attachment.name}</span>
          <a 
            href={attachment.url} 
            download={attachment.name}
            className="download-link"
            onClick={(e) => e.stopPropagation()}
          >
            Tải xuống
          </a>
        </>
      );
    }
  };

  return (
    <div className="message-dialog">
      <div className="message-header">
        <div className="contact-info">
          <div className="profile-image">
            {contact?.avatar ? (
              <img 
                src={contact.avatar} 
                alt={`Avatar của ${contact.name || 'Trần Thị Hoa'}`} 
                className="profile-avatar"
              />
            ) : (
              <div className="profile-placeholder"></div>
            )}
          </div>
          <div className="contact-details">
            <h3>{contact?.name || 'Trần Thị Hoa'}</h3>
            <div className="status">
              {contact?.isOnline ? (
                <>
                  <span className="status-dot online"></span>
                  <span className="status-text">Đang hoạt động</span>
                </>
              ) : (
                <>
                  <span className="status-dot offline"></span>
                  <span className="status-text">Không hoạt động</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <span>&times;</span>
        </button>
      </div>
      
      <div className="messages-container">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender === 'user' ? 'sent' : 'received'}`}
          >
            <div className="message-bubble">
              <p>{msg.text}</p>
              {msg.attachment && (
                <div className={`attachment-preview ${msg.attachment.type}`}>
                  {renderAttachmentContent(msg.attachment)}
                </div>
              )}
              <span className="message-time">
                {msg.time}
                {msg.sender === 'user' && (
                  <span className={`read-status ${msg.read ? 'read' : ''}`}>
                    {msg.read ? '✓✓' : '✓'}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p> đang nhập...</p>
          </div>
        )}
      </div>
      
      <div className="message-input">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <div className="attachment-container">
          <button className="attachment-button" onClick={handleAttachmentClick}>
            <span>+</span>
          </button>
          
          {showAttachmentMenu && (
            <div className="attachment-menu">
              <button onClick={() => handleAttachmentType('image')}>
                <span className="attachment-icon">🖼️</span>
                <span>Hình ảnh</span>
              </button>
              <button onClick={() => handleAttachmentType('document')}>
                <span className="attachment-icon">📄</span>
                <span>Tài liệu</span>
              </button>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          />
          
          <input
            type="file"
            ref={imageInputRef}
            style={{ display: 'none' }}
            onChange={handleImageSelect}
            accept="image/*"
          />
        </div>
        
        <button 
          className="send-button" 
          onClick={handleSendMessage}
          disabled={message.trim() === ''}
        >
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default MessageDialog;