import '../../styles/messageDialog/MessageDialog.css';
import React, { useState, useRef } from 'react';


const MessageDialog = ({ onClose, contact }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'contact',
      text: 'Căn hộ này còn sẵn không bạn?',
      time: '14:35',
      read: true
    },
    {
      id: 2,
      sender: 'user',
      text: 'Vâng, căn hộ vẫn còn sẵn. Bạn có muốn xem thêm thông tin không?',
      time: '14:37',
      read: true
    },
    {
      id: 3,
      sender: 'contact',
      text: 'Có ạ. Tôi muốn biết thêm về giá cả và các tiện ích. Căn hộ có bao gồm phí gửi xe và wifi không?',
      time: '14:40',
      read: true
    }
  ]);
  const [isTyping, setIsTyping] = useState(true);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);

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
      // Xử lý file được chọn
      const file = files[0];
      sendFileMessage(file);
      setShowAttachmentMenu(false);
    }
  };

  const sendFileMessage = (file) => {
    // Tạo message mới với thông tin file
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: `Đã gửi file: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      attachment: {
        name: file.name,
        type: file.type,
        size: file.size
      }
    };
    
    setMessages([...messages, newMessage]);
  };

  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const handleAttachmentType = (type) => {
    // Xử lý các loại đính kèm khác nhau
    switch (type) {
      case 'image':
        alert('Chọn hình ảnh để gửi');
        openFileExplorer();
        break;
      case 'document':
        alert('Chọn tài liệu để gửi');
        openFileExplorer();
        break;
      case 'location':
        // Giả lập gửi vị trí
        const locationMessage = {
          id: messages.length + 1,
          sender: 'user',
          text: 'Đã gửi vị trí: 10.7758° N, 106.7025° E',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          attachment: {
            type: 'location',
            name: 'Vị trí của tôi'
          }
        };
        setMessages([...messages, locationMessage]);
        setShowAttachmentMenu(false);
        break;
      default:
        openFileExplorer();
    }
  };

  return (
    <div className="message-dialog">
      <div className="message-header">
        <div className="contact-info">
          <div className="profile-image">
            <div className="profile-placeholder"></div>
          </div>
          <div className="contact-details">
            <h3>{contact?.name || 'Trần Thị Hoa'}</h3>
            <div className="status">
              <span className="status-dot online"></span>
              <span className="status-text">Đang hoạt động</span>
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
                  <span className="attachment-icon">📎</span>
                  <span className="attachment-name">{msg.attachment.name}</span>
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
            <p>Trần Thị Hoa đang nhập...</p>
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
              <button onClick={() => handleAttachmentType('location')}>
                <span className="attachment-icon">📍</span>
                <span>Vị trí</span>
              </button>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
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