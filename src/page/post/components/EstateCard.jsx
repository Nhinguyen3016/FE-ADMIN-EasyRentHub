import React from 'react';
import { MapPin, Star, Bed, Bath, Home, Eye } from 'lucide-react';
import bd1 from '../../../images/bd1.jpg';

const EstateCard = ({
  estate,
  onView,
  onApprove,
  formatCurrency,
  renderStatus
}) => {
  // Extract user's last name for the card
  const getUserLastName = () => {
    if (!estate || !estate.user || !estate.user.name) {
      return 'N/A';
    }
    try {
      return estate.user.name.split(' ').pop();
    } catch (error) {
      return 'N/A';
    }
  };

  // Normalize status to either 'booked' or 'available'
  // Any status other than 'available' will be treated as 'booked'
  const normalizedStatus = estate.status === 'available' ? 'available' : 'booked';

  return (
    <div className="estate-card">
      <div className="estate-card-image-container">
        <img
          src={estate.images && estate.images.length > 0 ? estate.images[0] : bd1}
          alt={estate.name || "Property"}
          className="estate-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = bd1;
          }}
        />
        <div className="estate-card-status">
          {renderStatus(normalizedStatus)}
        </div>
      </div>

      <div className="estate-card-content">
        <h3 className="estate-card-title">{estate.name || "Unnamed Property"}</h3>
        <div className="estate-card-address">
          <MapPin size={16} className="icon-fixed" />
          <p className="truncate-address">
            {estate.address?.road ? estate.address.road + ', ' : ''}
            {estate.address?.quarter ? estate.address.quarter + ', ' : ''}
            {estate.address?.city || 'N/A'}
          </p>
        </div>
        
        <div className="estate-card-stats">
          <div className="estate-card-rating">
            <Star size={16} className="icon-fixed" />
            <span>{estate.rating_star || 0}</span>
          </div>
          <div className="estate-card-price">{formatCurrency(estate.price || 0)}</div>
        </div>
        
        <div className="estate-card-features">
          <div className="estate-card-feature">
            <Bed size={16} className="icon-fixed" />
            <span>{estate.property?.bedroom || 0}</span>
          </div>
          <div className="estate-card-feature">
            <Bath size={16} className="icon-fixed" />
            <span>{estate.property?.bathroom || 0}</span>
          </div>
          <div className="estate-card-feature">
            <Home size={16} className="icon-fixed" />
            <span>{getUserLastName()}</span>
          </div>
        </div>
        
        <div className="estate-card-actions">
          <button
            onClick={() => onView(estate)}
            className="btn btn-view"
          >
            <Eye size={14} className="icon-fixed" /> Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstateCard;