import React, { useState } from 'react';
import '../../styles/post/PostManagement.css';
import arrowImg from '../../images/arrow.png';
import addImg from '../../images/add.png';
import seeImg from '../../images/see.png';
import writeImg from '../../images/write.png';
import deleteImg from '../../images/delete.png';

const PostManagementPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Cho thuê chung cư',
      author: 'Nguyễn Văn An',
      createdAt: '07:30 02/04/2025',
      updatedAt: '08:30 02/04/2025'
    },
    {
      id: 2,
      title: 'Cho thuê phòng trọ',
      author: 'Trần Thị Bích Ngọc',
      createdAt: '07:30 02/04/2025',
      updatedAt: '15:30 03/04/2025'
    },
    {
      id: 3,
      title: 'Cho thuê phòng trọ',
      author: 'Lê Minh Hoàng',
      createdAt: '07:30 02/04/2025',
      updatedAt: ''
    },
    {
      id: 4,
      title: 'Cho thuê phòng trọ',
      author: 'Phạm Hồng Phúc',
      createdAt: '07:30 02/04/2025',
      updatedAt: '10:30 04/04/2025'
    },
    {
      id: 5,
      title: 'Cho thuê phòng trọ',
      author: 'Đặng Thị Thu Hương',
      createdAt: '07:30 02/04/2025',
      updatedAt: ''
    }
  ]);

  // Default empty string for role filtering
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Handle author change
  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter posts by role, author and search query
  const filteredPosts = posts.filter(post => {
    const authorMatches = selectedAuthor ? post.author === selectedAuthor : true;
    
    const searchMatches = searchQuery 
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return authorMatches && searchMatches;
  });

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleEdit = (id) => {
    console.log('Edit post with id:', id);
  };

  const handleView = (id) => {
    console.log('View post with id:', id);
  };

  const handleAddPost = () => {
    console.log('Add new post');
  };

  return (
    <div className="post-table-container">
      <div className="table-actions">
        <div className="role-dropdown">
          <select value={selectedRole} onChange={handleRoleChange}>
            <option value="">Vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="owner">Chủ nhà</option>
            <option value="tenant">Người thuê</option>
          </select>
          <img src={arrowImg} alt="Dropdown arrow" className="dropdown-arrow" />
        </div>

        <div className="author-dropdown">
          <select value={selectedAuthor} onChange={handleAuthorChange}>
            <option value="">Tác giả</option>
            <option value="Nguyễn Văn An">Nguyễn Văn An</option>
            <option value="Trần Thị Bích Ngọc">Trần Thị Bích Ngọc</option>
            <option value="Lê Minh Hoàng">Lê Minh Hoàng</option>
            <option value="Phạm Hồng Phúc">Phạm Hồng Phúc</option>
            <option value="Đặng Thị Thu Hương">Đặng Thị Thu Hương</option>
          </select>
          <img src={arrowImg} alt="Dropdown arrow" className="dropdown-arrow" />
        </div>

        <button className="add-button" onClick={handleAddPost}>
          <img src={addImg} alt="Add" className="add-icon" />
          <span>Tạo mới</span>
        </button>
      </div>

      {/* Post Table with filtered data */}
      <table className="post-table">
        <thead>
          <tr>
            <th>Tên bài đăng</th>
            <th>Tác giả</th>
            <th>Ngày tạo</th>
            <th>Ngày chỉnh sửa</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.createdAt}</td>
                <td>{post.updatedAt}</td>
                <td className="action-buttons">
                  <button className="see-button" onClick={() => handleView(post.id)}>
                    <img src={seeImg} alt="Xem" className="see-icon" />
                  </button>
                  <button className="edit-button" onClick={() => handleEdit(post.id)}>
                    <img src={writeImg} alt="Edit" className="edit-icon" />
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(post.id)}>
                    <img src={deleteImg} alt="Delete" className="delete-icon" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-posts-message">Không tìm thấy bài đăng nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PostManagementPage;