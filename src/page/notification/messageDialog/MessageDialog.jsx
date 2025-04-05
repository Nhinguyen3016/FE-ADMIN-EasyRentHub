import '../../../styles/notification/messageDialog/MessageDialog.css';
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
    // Create a file URL to reference the file
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
    // Create a URL for the image preview
    const imageUrl = URL.createObjectURL(file);
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
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

  // Function to render attachment content based on type
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