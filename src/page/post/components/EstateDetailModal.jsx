import React, { useState } from 'react';
import { ChevronLeft, MapPin, Star, Heart, MessageSquare, DollarSign, Bed, Bath, Building, CheckCircle, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
import '../../../styles/post/components/EstateDetailModal.css';

const EstateDetailModal = ({ estate, onClose, onDelete, onEdit, onApprove }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!estate) return null;
  
  const fullAddress = `${estate.address?.house_number || ''} ${estate.address?.road || ''}, ${estate.address?.quarter || ''}, ${estate.address?.city || ''}, ${estate.address?.country || ''}`;
  
  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' VNĐ';
  };

  // Format datetime
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    try {
      const date = new Date(dateTimeStr);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Display status
  const renderStatus = (status) => {
    const statusConfig = {
      available: {
        label: 'Có sẵn',
        icon: <CheckCircle size={14} className="mr-1" />,
        classes: 'status-available'
      },
      pending: {
        label: 'Chờ duyệt',
        icon: <Clock size={14} className="mr-1" />,
        classes: 'status-pending'
      },
      booked: {
        label: 'Đã đặt',
        icon: <AlertCircle size={14} className="mr-1" />,
        classes: 'status-booked'
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.classes}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (typeof onDelete === 'function') {
      onDelete(estate.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Handle edit click with safety check
  const handleEditClick = () => {
    if (typeof onEdit === 'function') {
      onEdit(estate);
    } else {
      console.warn('onEdit function is not provided to EstateDetailModal');
    }
  };

  // Handle approve click with safety check
  const handleApproveClick = () => {
    if (typeof onApprove === 'function') {
      onApprove(estate.id);
      onClose();
    } else {
      console.warn('onApprove function is not provided to EstateDetailModal');
    }
  };

  // Safely access arrays
  const images = estate.images || [];
  const likes = estate.likes || [];
  const reviews = estate.reviews || [];
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Chi tiết bài đăng</h2>
            <button onClick={onClose} className="modal-close-btn">
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="modal-body">
            {/* Left column - Images */}
            <div className="estate-images">
              <div className="estate-main-image">
                <img 
                  src={images.length > 0 ? images[0] : '/placeholder-image.jpg'} 
                  alt={estate.name || 'Property'} 
                />
              </div>
              <div className="estate-thumbnail-grid">
                {images.slice(1).map((img, index) => (
                  <div key={index} className="estate-thumbnail">
                    <img 
                      src={img} 
                      alt={`${estate.name || 'Property'} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column - Details */}
            <div className="estate-details">
              <div className="estate-header">
                <h3 className="estate-title">{estate.name || 'Untitled Property'}</h3>
                {renderStatus(estate.status)}
              </div>
              
              <div className="estate-address">
                <MapPin size={16} className="mr-1" />
                {fullAddress}
              </div>
              
              <div className="estate-stats">
                <div className="estate-rating">
                  <Star size={16} className="mr-1" />
                  <span>{estate.rating_star || 0}</span>
                </div>
                <div className="estate-likes">
                  <Heart size={16} className="mr-1" />
                  <span>{likes.length}</span>
                </div>
                <div className="estate-reviews">
                  <MessageSquare size={16} className="mr-1" />
                  <span>{reviews.length} đánh giá</span>
                </div>
              </div>
              
              <div className="estate-price-box">
                <div className="estate-price">
                  <DollarSign size={20} className="mr-1" />
                  {formatCurrency(estate.price || 0)}
                </div>
                <p className="estate-price-note">Giá cho thuê hàng tháng</p>
              </div>
              
              <div className="estate-properties">
                <div className="estate-property">
                  <Bed size={20} className="property-icon" />
                  <span className="property-label">Phòng ngủ</span>
                  <p className="property-value">{estate.property?.bedroom || 0}</p>
                </div>
                <div className="estate-property">
                  <Bath size={20} className="property-icon" />
                  <span className="property-label">Phòng tắm</span>
                  <p className="property-value">{estate.property?.bathroom || 0}</p>
                </div>
                <div className="estate-property">
                  <Building size={20} className="property-icon" />
                  <span className="property-label">Tầng</span>
                  <p className="property-value">{estate.property?.floors || 0}</p>
                </div>
              </div>
              
              <div className="estate-owner-info">
                <h4 className="info-title">Thông tin chủ sở hữu</h4>
                <p><span className="info-label">Tên:</span> {estate.user?.name || 'N/A'}</p>
                <p><span className="info-label">Email:</span> {estate.user?.email || 'N/A'}</p>
                <p><span className="info-label">Điện thoại:</span> {estate.user?.phone || 'N/A'}</p>
              </div>
              
              <div className="estate-post-info">
                <h4 className="info-title">Thông tin đăng bài</h4>
                <p><span className="info-label">Ngày tạo:</span> {formatDateTime(estate.createdAt)}</p>
                <p><span className="info-label">Cập nhật lần cuối:</span> {formatDateTime(estate.updatedAt)}</p>
              </div>
              
              <div className="estate-actions">
                {estate.status === 'pending' && (
                  <button className="btn btn-approve" onClick={handleApproveClick}>
                    <CheckCircle size={16} className="mr-2" />
                    Phê duyệt
                  </button>
                )}
                <button className="btn btn-edit" onClick={handleEditClick}>
                  <Edit size={16} className="mr-2" />
                  Chỉnh sửa
                </button>
                <button className="btn btn-delete" onClick={handleDeleteClick}>
                  <Trash2 size={16} className="mr-2" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay">
          <div className="delete-confirmation-modal">
            <h3 className="delete-confirmation-title">Xác nhận xóa</h3>
            <p className="delete-confirmation-message">
              Bạn có chắc chắn muốn xóa bài đăng "{estate.name || 'Untitled Property'}"?
            </p>
            <div className="delete-confirmation-actions">
              <button className="btn btn-cancel" onClick={handleDeleteCancel}>
                Hủy
              </button>
              <button className="btn btn-delete" onClick={handleDeleteConfirm}>
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateDetailModal;