import '../../../styles/notification/messageDialog/MessageDialog.css';
import React, { useState, useRef, useEffect } from 'react';

const MessageDialog = ({ onClose, contact }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);


  useEffect(() => {
    const fetchMessages = async () => {
      if (!contact || !contact.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:5000/api/messages/${contact.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load messages');
        }
        
        const data = await response.json();
        
      
        const formattedMessages = data.map(msg => ({
          id: msg._id,
          sender: msg.sender === contact.userId ? 'admin' : 'user', // 'admin' is the contact, 'user' is the current user
          text: msg.text,
          time: formatTime(new Date(msg.createdAt)),
          read: msg.read || false,
          attachment: msg.attachmentUrl ? {
            name: msg.attachmentName || 'Attachment',
            type: getAttachmentType(msg.attachmentUrl),
            size: msg.attachmentSize || 0,
            url: msg.attachmentUrl
          } : null
        }));
        
        setMessages(formattedMessages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [contact]);


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAttachmentType = (url) => {
    if (!url) return 'document';
    const extension = url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    return imageExtensions.includes(extension) ? 'image' : 'document';
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    
    const currentTime = new Date();
    const newMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user', 
      text: message,
      time: formatTime(currentTime),
      read: false
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      
 
      let userId = null;
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          userId = payload.id || payload.userId || payload._id;
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
      
      if (!userId) {
        throw new Error('Cannot get userId from token');
      }
      

      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: contact.id,
          sender: userId,
          text: message,
          createdAt: currentTime.toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
 
      const updateConversationResponse = await fetch(`http://localhost:5000/api/messages/conversations/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lastMessage: message,
          lastUpdated: currentTime.toISOString()
        })
      });
      
      if (!updateConversationResponse.ok) {
        console.warn('Failed to update conversation last message');
      }
      
      const data = await response.json();

      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id 
            ? {
                id: data._id,
                sender: 'user',
                text: data.text,
                time: formatTime(new Date(data.createdAt)),
                read: data.read || false
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
   
      alert('Failed to send message. Please try again.');
    }
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

  const sendFileMessage = async (file) => {
    try {
      const token = localStorage.getItem('token');
      
    
      let userId = null;
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          userId = payload.id || payload.userId || payload._id;
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
      
      if (!userId) {
        throw new Error('Cannot get userId from token');
      }
      
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', contact.id);
      formData.append('sender', userId);
      formData.append('text', `Đã gửi file: ${file.name}`);
      

      const tempFileUrl = URL.createObjectURL(file);
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender: 'user',
        text: `Đã gửi file: ${file.name}`,
        time: formatTime(new Date()),
        read: false,
        attachment: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: tempFileUrl
        }
      };
      
 
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
  
      const response = await fetch('http://localhost:5000/api/messages/attachment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to send file');
      }
      
      const data = await response.json();
      
  
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempMessage.id 
            ? {
                id: data._id,
                sender: 'user',
                text: data.text,
                time: formatTime(new Date(data.createdAt)),
                read: data.read || false,
                attachment: {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  url: data.attachmentUrl || tempFileUrl
                }
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Error sending file:', err);
      alert('Failed to send file. Please try again.');
    }
  };

  const sendImageMessage = async (file) => {
    try {
      const token = localStorage.getItem('token');
      
   
      let userId = null;
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          userId = payload.id || payload.userId || payload._id;
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
      
      if (!userId) {
        throw new Error('Cannot get userId from token');
      }
     
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', contact.id);
      formData.append('sender', userId);
      formData.append('text', `Đã gửi hình ảnh: ${file.name}`);
      

      const tempImageUrl = URL.createObjectURL(file);
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender: 'user',
        text: `Đã gửi hình ảnh: ${file.name}`,
        time: formatTime(new Date()),
        read: false,
        attachment: {
          name: file.name,
          type: 'image',
          size: file.size,
          url: tempImageUrl
        }
      };
      
      // Add to UI immediately
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      // Send to server
      const response = await fetch('http://localhost:5000/api/messages/attachment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to send image');
      }
      
      const data = await response.json();
      
      // Replace temp message with server data
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempMessage.id 
            ? {
                id: data._id,
                sender: 'user',
                text: data.text,
                time: formatTime(new Date(data.createdAt)),
                read: data.read || false,
                attachment: {
                  name: file.name,
                  type: 'image',
                  size: file.size,
                  url: data.attachmentUrl || tempImageUrl
                }
              }
            : msg
        )
      );
    } catch (err) {
      console.error('Error sending image:', err);
      alert('Failed to send image. Please try again.');
    }
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
                alt={`Avatar của ${contact.name || 'Người dùng'}`} 
                className="profile-avatar"
              />
            ) : (
              <div className="profile-placeholder"></div>
            )}
          </div>
          <div className="contact-details">
            <h3>{contact?.name || 'Người dùng'}</h3>
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
      
      <div className="messages-container" ref={messagesContainerRef}>
        {loading ? (
          <div className="loading-messages">Đang tải tin nhắn...</div>
        ) : error ? (
          <div className="error-messages">Lỗi: {error}</div>
        ) : messages.length === 0 ? (
          <div className="no-messages">Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</div>
        ) : (
          messages.map(msg => (
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
          ))
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>{contact?.name || 'Người dùng'} đang nhập...</p>
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