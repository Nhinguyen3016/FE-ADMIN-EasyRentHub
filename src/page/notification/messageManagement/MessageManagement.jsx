import React, { useState, useEffect } from 'react';
import '../../../styles/notification/messageManagement/MessageManagement.css';
import MessageDialog from '../messageDialog/MessageDialog';
import avatar1 from '../../../images/avatar1.jpg'; 

const MessageManagement = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const defaultAvatar = avatar1;
  
  useEffect(() => {
    const fetchData = async () => {
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
            setCurrentUserId(userId);
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }
        
        if (!userId) {
          throw new Error('Cannot get userId from token');
        }

    
        const allUsersResponse = await fetch(`http://localhost:5000/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!allUsersResponse.ok) {
          throw new Error('Cannot load users data');
        }
        
        const allUsersData = await allUsersResponse.json();
        console.log("All users data:", allUsersData);
        const usersArray = allUsersData.users || allUsersData || [];
        const landlordsData = usersArray.filter(user => 
          (user.role === 'Landlord' || user.role === 'landlord') &&
          user.status !== 'locked' && 
          user.status !== 'inactive' &&
          user.isActive !== false
        );
        console.log("Landlords data:", landlordsData);
        setLandlords(landlordsData);
        const response = await fetch(`http://localhost:5000/api/messages/conversations/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Cannot load conversation data');
        }
        
        const data = await response.json();
        console.log("Fetched conversations:", data);
        setConversations(data);
        const userIds = new Set();
        data.forEach(conversation => {
          conversation.members.forEach(memberId => {
            if (memberId !== userId) {
              userIds.add(memberId);
            }
          });
        });
        
        console.log("User IDs to fetch:", Array.from(userIds));
        
        const usersInfo = {};
        usersArray.forEach(user => {
          if (user._id) {
            usersInfo[user._id] = user;
          }
        });
  
        const missingUserIds = Array.from(userIds).filter(id => !usersInfo[id]);
        
        if (missingUserIds.length > 0) {
          console.log("Missing user IDs, fetching individually:", missingUserIds);
          
          await Promise.all(missingUserIds.map(async (memberId) => {
            try {
              const userResponse = await fetch(`http://localhost:5000/api/user/${memberId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log(`User data for ${memberId}:`, userData);
                usersInfo[memberId] = userData;
              } else {
                console.log(`Failed to fetch user from /api/user/${memberId}, trying /api/users/${memberId}`);
                
                const usersResponse = await fetch(`http://localhost:5000/api/users/${memberId}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                
                if (usersResponse.ok) {
                  const userData = await usersResponse.json();
                  console.log(`User data for ${memberId} from /api/users/:id:`, userData);
                  usersInfo[memberId] = userData;
                } else {
                  console.warn(`Cannot get user info with ID: ${memberId} from any endpoint`);
                }
              }
            } catch (err) {
              console.error(`Error getting user info ${memberId}:`, err);
            }
          }));
        }
        
        console.log("Final users data:", usersInfo);
        setUsersData(usersInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getOtherUserFromConversation = (conversation) => {
    if (!conversation || !conversation.members || !currentUserId) return null;
    
    const otherUserId = conversation.members.find(id => id !== currentUserId);
    console.log(`Other user ID: ${otherUserId}, User data:`, usersData[otherUserId]);
    
    return otherUserId ? usersData[otherUserId] : null;
  };
  
  const getUserDisplayName = (userData) => {
    if (!userData) return "Unknown User";
    
    if (userData.full_name) return userData.full_name;
    if (userData.fullName) return userData.fullName;
    if (userData.name) return userData.name;
    if (userData.username) return userData.username;
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (userData.lastName) return userData.lastName; 
    if (userData.firstName) return userData.firstName; 
    
    if (userData.user && typeof userData.user === 'object') {
      const user = userData.user;
      if (user.full_name) return user.full_name;
      if (user.fullName) return user.fullName;
      if (user.name) return user.name; 
      if (user.username) return user.username;
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
    }
    
    return `User (ID: ${userData._id || "Unknown"})`;
  };

  const getUserAvatar = (userData) => {
    if (!userData) return defaultAvatar;
    
    if (userData.avatar && userData.avatar.startsWith('http')) return userData.avatar;
    if (userData.profilePicture && userData.profilePicture.startsWith('http')) return userData.profilePicture;
    if (userData.profileImage && userData.profileImage.startsWith('http')) return userData.profileImage;
    if (userData.image && userData.image.startsWith('http')) return userData.image;
    
    if (userData.avatar) return `http://localhost:5000${userData.avatar.startsWith('/') ? '' : '/'}${userData.avatar}`;
    if (userData.profilePicture) return `http://localhost:5000${userData.profilePicture.startsWith('/') ? '' : '/'}${userData.profilePicture}`;
    if (userData.profileImage) return `http://localhost:5000${userData.profileImage.startsWith('/') ? '' : '/'}${userData.profileImage}`;
    if (userData.image) return `http://localhost:5000${userData.image.startsWith('/') ? '' : '/'}${userData.image}`;
    
    if (userData.user && typeof userData.user === 'object') {
      const user = userData.user;
      if (user.avatar && user.avatar.startsWith('http')) return user.avatar;
      if (user.profilePicture && user.profilePicture.startsWith('http')) return user.profilePicture;
      if (user.avatar) return `http://localhost:5000${user.avatar.startsWith('/') ? '' : '/'}${user.avatar}`;
      if (user.profilePicture) return `http://localhost:5000${user.profilePicture.startsWith('/') ? '' : '/'}${user.profilePicture}`;
    }
    
    return defaultAvatar;
  };

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      return `${diffDays} ngày trước`;
    }
  };
  
  const handleMessageClick = (contact) => {
    setSelectedContact(contact);
  };
  
  const handleCloseDialog = () => {
    setSelectedContact(null);
  };

  const handleLandlordClick = async (landlord) => {
    setSelectedLandlord(landlord);
   
    const existingConversation = conversations.find(conversation => 
      conversation.members.includes(landlord._id)
    );
    
    if (existingConversation) {
     
      const otherUser = getOtherUserFromConversation(existingConversation);
      const displayName = getUserDisplayName(otherUser);
      const userAvatar = getUserAvatar(otherUser);
      
      setSelectedContact({
        id: existingConversation._id,
        name: displayName,
        userId: landlord._id,
        avatar: userAvatar,
        isOnline: Math.random() > 0.5 
      });
    } else {
  
      const displayName = getUserDisplayName(landlord);
      const userAvatar = getUserAvatar(landlord);
      
      setSelectedContact({
        id: null, 
        name: displayName,
        userId: landlord._id,
        avatar: userAvatar,
        isOnline: Math.random() > 0.5, 
        isNewConversation: true
      });
    }
  };


  const getFilteredItems = () => {
    const filteredConversations = conversations.filter(conversation => {
      const otherUser = getOtherUserFromConversation(conversation);
      const displayName = getUserDisplayName(otherUser);
      return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (conversation.lastMessage && conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    if (!searchQuery.trim()) {
      return { conversations: filteredConversations, landlords: [] };
    }
    const conversationUserIds = new Set(
      conversations.flatMap(conv => conv.members.filter(id => id !== currentUserId))
    );

    const filteredLandlords = landlords.filter(landlord => {
      const displayName = getUserDisplayName(landlord);
      const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const hasNoConversation = !conversationUserIds.has(landlord._id);
      return matchesSearch && hasNoConversation;
    });

    return { conversations: filteredConversations, landlords: filteredLandlords };
  };

  const { conversations: filteredConversations, landlords: filteredLandlordsWithoutConv } = getFilteredItems();
  
  if (loading) {
    return <div className="message-management-container">Đang tải dữ liệu...</div>;
  }
  
  if (error) {
    return <div className="message-management-container">Lỗi: {error}</div>;
  }
  
  return (
    <div className={`message-management-container ${selectedContact ? 'chat-open' : ''}`}>
      <div className="message-management-mssm">
        <h1 className="header-mssm">Quản lý tin nhắn</h1>
        
        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm chủ nhà..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Landlords Section */}
        <div className="landlords-section">
          <h3 className="landlords-title">Chủ nhà</h3>
          <div className="landlords-list-container">
            <div className="landlords-list">
              {landlords.map((landlord, index) => (
                <div 
                  key={landlord._id} 
                  className={`landlord-item ${selectedLandlord && selectedLandlord._id === landlord._id ? 'selected' : ''}`}
                  onClick={() => handleLandlordClick(landlord)}
                >
                  <div className="landlord-avatar-container">
                    <img 
                      src={getUserAvatar(landlord)} 
                      alt={`Avatar của ${getUserDisplayName(landlord)}`} 
                      className="landlord-avatar"
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />
                    {/* Random online status for demo */}
                    {index % 3 === 0 && <span className="online-indicator"></span>}
                  </div>
                  <span className="landlord-name">{getUserDisplayName(landlord)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="divider-mssm"></div>
        
        {/* Recent Messages Section */}
        <div className="recent-messages-section">
          <h3 className="recent-messages-title">Tin nhắn gần đây</h3>
          
          <div className="message-list-mssm">
            {filteredConversations.length === 0 && filteredLandlordsWithoutConv.length === 0 ? (
              <div className="no-messages">
                {searchQuery ? 'Không tìm thấy tin nhắn nào' : 'Không có tin nhắn nào'}
              </div>
            ) : (
              <>
                {/* Hiển thị conversations */}
                {filteredConversations.map((conversation, index) => {
                  const otherUser = getOtherUserFromConversation(conversation);
                  const displayName = getUserDisplayName(otherUser);
                  const otherUserId = conversation.members.find(id => id !== currentUserId);
                  const userAvatar = getUserAvatar(otherUser);
                  
                  console.log(`Rendering conversation ${index}:`, {
                    conversationId: conversation._id,
                    otherUserId,
                    displayName,
                    otherUser,
                    avatar: userAvatar
                  });
             
                  const isOnline = index % 2 === 0;
                  
                  return (
                    <div
                      key={conversation._id}
                      className={`message-item-mssm ${selectedContact && selectedContact.id === conversation._id ? 'active' : ''}`}
                      onClick={() => handleMessageClick({
                        id: conversation._id,
                        name: displayName,
                        userId: otherUserId,
                        avatar: userAvatar,
                        isOnline: isOnline
                      })}
                    >
                      <div className="avatar-container-mssm">
                        <img 
                          src={userAvatar} 
                          alt={`Avatar của ${displayName}`} 
                          className="avatar-image-mssm"
                          onError={(e) => {
                            console.log("Avatar load error, using default");
                            e.target.src = defaultAvatar;
                          }}
                        />
                        {isOnline && <span className="online-indicator-mssm"></span>}
                      </div>
                      <div className="message-content-mssm">
                        <div className="message-header-mssm">
                          <span className="sender-name-mssm">{displayName}</span>
                          <div className="time-status-container">
                            <span className="message-time-mssm">{formatTimeAgo(conversation.lastUpdated)}</span>
                            <span className="read-status-indicator read">✓✓</span>
                          </div>
                        </div>
                        <div className="message-preview-container">
                          <p className="message-text-mssm">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Hiển thị landlords chưa có conversation khi có tìm kiếm */}
                {searchQuery && filteredLandlordsWithoutConv.map((landlord, index) => {
                  const displayName = getUserDisplayName(landlord);
                  const userAvatar = getUserAvatar(landlord);
                  const isOnline = index % 3 === 0; // Random online status
                  
                  return (
                    <div
                      key={`landlord-${landlord._id}`}
                      className={`message-item-mssm landlord-search-result ${selectedContact && selectedContact.userId === landlord._id ? 'active' : ''}`}
                      onClick={() => handleLandlordClick(landlord)}
                    >
                      <div className="avatar-container-mssm">
                        <img 
                          src={userAvatar} 
                          alt={`Avatar của ${displayName}`} 
                          className="avatar-image-mssm"
                          onError={(e) => {
                            e.target.src = defaultAvatar;
                          }}
                        />
                        {isOnline && <span className="online-indicator-mssm"></span>}
                      </div>
                      <div className="message-content-mssm">
                        <div className="message-header-mssm">
                          <span className="sender-name-mssm">{displayName}</span>
                          <div className="time-status-container">
                            <span className="new-conversation-badge">Cuộc trò chuyện mới</span>
                          </div>
                        </div>
                        <div className="message-preview-container">
                          <p className="message-text-mssm no-message">Bắt đầu cuộc trò chuyện với chủ nhà này</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
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