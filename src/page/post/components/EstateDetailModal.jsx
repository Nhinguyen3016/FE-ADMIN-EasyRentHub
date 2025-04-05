import React from 'react';
import { ChevronLeft, MapPin, Star, Heart, MessageSquare, DollarSign, Bed, Bath, Building, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Clock, AlertCircle } from 'lucide-react';
import '../../../styles/post/components/EstateDetailModal.css';
const EstateDetailModal = ({ estate, onClose }) => {
  if (!estate) return null;
  
  const fullAddress = `${estate.address.house_number} ${estate.address.road}, ${estate.address.quarter}, ${estate.address.city}, ${estate.address.country}`;
  
  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' VNĐ';
  };

  // Format datetime
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
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
                  src={estate.images[0]} 
                  alt={estate.name} 
                />
              </div>
              <div className="estate-thumbnail-grid">
                {estate.images.slice(1).map((img, index) => (
                  <div key={index} className="estate-thumbnail">
                    <img 
                      src={img} 
                      alt={`${estate.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right column - Details */}
            <div className="estate-details">
              <div className="estate-header">
                <h3 className="estate-title">{estate.name}</h3>
                {renderStatus(estate.status)}
              </div>
              
              <div className="estate-address">
                <MapPin size={16} className="mr-1" />
                {fullAddress}
              </div>
              
              <div className="estate-stats">
                <div className="estate-rating">
                  <Star size={16} className="mr-1" />
                  <span>{estate.rating_star}</span>
                </div>
                <div className="estate-likes">
                  <Heart size={16} className="mr-1" />
                  <span>{estate.likes.length}</span>
                </div>
                <div className="estate-reviews">
                  <MessageSquare size={16} className="mr-1" />
                  <span>{estate.reviews.length} đánh giá</span>
                </div>
              </div>
              
              <div className="estate-price-box">
                <div className="estate-price">
                  <DollarSign size={20} className="mr-1" />
                  {formatCurrency(estate.price)}
                </div>
                <p className="estate-price-note">Giá cho thuê hàng tháng</p>
              </div>
              
              <div className="estate-properties">
                <div className="estate-property">
                  <Bed size={20} className="property-icon" />
                  <span className="property-label">Phòng ngủ</span>
                  <p className="property-value">{estate.property.bedroom}</p>
                </div>
                <div className="estate-property">
                  <Bath size={20} className="property-icon" />
                  <span className="property-label">Phòng tắm</span>
                  <p className="property-value">{estate.property.bathroom}</p>
                </div>
                <div className="estate-property">
                  <Building size={20} className="property-icon" />
                  <span className="property-label">Tầng</span>
                  <p className="property-value">{estate.property.floors}</p>
                </div>
              </div>
              
              <div className="estate-owner-info">
                <h4 className="info-title">Thông tin chủ sở hữu</h4>
                <p><span className="info-label">Tên:</span> {estate.user.name}</p>
                <p><span className="info-label">Email:</span> {estate.user.email}</p>
                <p><span className="info-label">Điện thoại:</span> {estate.user.phone}</p>
              </div>
              
              <div className="estate-post-info">
                <h4 className="info-title">Thông tin đăng bài</h4>
                <p><span className="info-label">Ngày tạo:</span> {formatDateTime(estate.createdAt)}</p>
                <p><span className="info-label">Cập nhật lần cuối:</span> {formatDateTime(estate.updatedAt)}</p>
              </div>
              
              <div className="estate-actions">
                <button className="btn btn-approve">
                  <CheckCircle size={16} className="mr-2" />
                  Phê duyệt
                </button>
                <button className="btn btn-edit">
                  <Edit size={16} className="mr-2" />
                  Chỉnh sửa
                </button>
                <button className="btn btn-delete">
                  <Trash2 size={16} className="mr-2" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateDetailModal;