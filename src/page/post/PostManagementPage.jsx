import '../../styles/post/PostManagement.css';
import React, { useState } from 'react';
import { Search, PlusCircle, Filter, CheckCircle, AlertCircle, Clock, Home, Eye, Flag, MapPin, Star, Bed, Bath } from 'lucide-react';
import EstateDetailModal from './components/EstateDetailModal'; 
import EstateEditForm from './components/EstateEditForm';
import { FileText } from "lucide-react";


// Import images
import bd1 from '../../images/bd1.jpg';
import bd2 from '../../images/bd2.jpg';
import bd3 from '../../images/bd3.jpg';
import bd4 from '../../images/bd4.jpg';
import bd5 from '../../images/bd5.jpg';
import bd6 from '../../images/bd6.jpg';
import bd7 from '../../images/bd7.jpg';
import bd8 from '../../images/bd8.jpg';

const EstateManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  // Sample data based on schema
  const [estates, setEstates] = useState([
    {
      id: '1',
      name: 'Căn hộ cao cấp Sunshine',
      address: {
        house_number: 123,
        road: 'Nguyễn Văn Trỗi',
        quarter: 'Thanh Xuân',
        city: 'Hà Nội',
        country: 'Việt Nam',
        lat: '21.0245',
        lng: '105.8412'
      },
      images: [
        bd1,
        bd2,
        bd3
      ],
      rating_star: 4.8,
      price: 12000000,
      rental: true,
      property: {
        bedroom: 3,
        bathroom: 2,
        floors: 1
      },
      status: 'available',
      likes: ['user1', 'user2', 'user3'],
      reviews: ['review1', 'review2'],
      user: {
        _id: 'user123',
        name: 'Nguyễn Văn An',
        email: 'an@example.com',
        phone: '0981234567'
      },
      distance: 2.5,
      createdAt: '2025-04-02T07:30:00',
      updatedAt: '2025-04-02T08:30:00',
    },
    {
      id: '2',
      name: 'Phòng cho thuê trung tâm Quận 1',
      address: {
        house_number: 45,
        road: 'Nguyễn Huệ',
        quarter: 'Quận 1',
        city: 'Hồ Chí Minh',
        country: 'Việt Nam',
        lat: '10.7721',
        lng: '106.7037'
      },
      images: [
        bd4,
        bd5,
      ],
      rating_star: 4.2,
      price: 4500000,
      rental: true,
      property: {
        bedroom: 1,
        bathroom: 1,
        floors: 1
      },
      status: 'pending',
      likes: ['user4', 'user5'],
      reviews: ['review3'],
      user: {
        _id: 'user456',
        name: 'Trần Thị Bích Ngọc',
        email: 'ngoc@example.com',
        phone: '0911234567'
      },
      distance: 1.2,
      createdAt: '2025-04-01T09:15:00',
      updatedAt: '2025-04-03T15:30:00',
    },
    {
      id: '3',
      name: 'Nhà nguyên căn view biển',
      address: {
        house_number: 78,
        road: 'Nguyễn Tất Thành',
        quarter: 'Hải Châu',
        city: 'Đà Nẵng',
        country: 'Việt Nam',
        lat: '16.0718',
        lng: '108.2172'
      },
      images: [
        bd6,
        bd7,
        bd8,
        bd1,
      ],
      rating_star: 4.9,
      price: 8500000,
      rental: true,
      property: {
        bedroom: 4,
        bathroom: 3,
        floors: 2
      },
      status: 'available',
      likes: ['user1', 'user6', 'user7', 'user8'],
      reviews: ['review4', 'review5', 'review6'],
      user: {
        _id: 'user789',
        name: 'Lê Minh Hoàng',
        email: 'hoang@example.com',
        phone: '0971234567'
      },
      distance: 0.5,
      createdAt: '2025-03-29T14:20:00',
      updatedAt: '2025-04-02T07:30:00',
    },
    {
      id: '4',
      name: 'Phòng studio hiện đại Cầu Giấy',
      address: {
        house_number: 32,
        road: 'Cầu Giấy',
        quarter: 'Cầu Giấy',
        city: 'Hà Nội',
        country: 'Việt Nam',
        lat: '21.0357',
        lng: '105.7954'
      },
      images: [
        bd2,
        bd3,
      ],
      rating_star: 3.9,
      price: 4000000,
      rental: true,
      property: {
        bedroom: 1,
        bathroom: 1,
        floors: 1
      },
      status: 'booked',
      likes: ['user9'],
      reviews: ['review7'],
      user: {
        _id: 'user101',
        name: 'Phạm Hồng Phúc',
        email: 'phuc@example.com',
        phone: '0961234567'
      },
      distance: 3.2,
      createdAt: '2025-03-31T10:45:00',
      updatedAt: '2025-04-04T10:30:00',
    },
    {
      id: '5',
      name: 'Nhà trọ sinh viên',
      address: {
        house_number: 56,
        road: 'Lê Lợi',
        quarter: 'Vinh',
        city: 'Nghệ An',
        country: 'Việt Nam',
        lat: '18.6793',
        lng: '105.6795'
      },
      images: [
        bd5,
      ],
      rating_star: 3.5,
      price: 2800000,
      rental: true,
      property: {
        bedroom: 1,
        bathroom: 1,
        floors: 1
      },
      status: 'pending',
      likes: [],
      reviews: [],
      user: {
        _id: 'user102',
        name: 'Đặng Thị Thu Hương',
        email: 'huong@example.com',
        phone: '0951234567'
      },
      distance: 1.8,
      createdAt: '2025-04-01T08:00:00',
      updatedAt: '2025-04-01T08:00:00',
    },
    {
      id: '6',
      name: 'Biệt thự vườn Flamingo Đại Lải',
      address: {
        house_number: 89,
        road: 'Vinhomes Đại Lải',
        quarter: 'Phúc Yên',
        city: 'Vĩnh Phúc',
        country: 'Việt Nam',
        lat: '21.3851',
        lng: '105.7198'
      },
      images: [
        bd8,
        bd7,
        bd6,
        bd4,
      ],
      rating_star: 4.7,
      price: 15000000,
      rental: true,
      property: {
        bedroom: 5,
        bathroom: 4,
        floors: 2
      },
      status: 'available',
      likes: ['user1', 'user3', 'user7', 'user10', 'user11'],
      reviews: ['review8', 'review9', 'review10', 'review11'],
      user: {
        _id: 'user103',
        name: 'Vũ Thanh Tùng',
        email: 'tung@example.com',
        phone: '0968765432'
      },
      distance: 15.7,
      createdAt: '2025-03-25T14:20:00',
      updatedAt: '2025-04-01T09:15:00',
    },
    {
      id: '7',
      name: 'Chung cư cao cấp Central Park',
      address: {
        house_number: 12,
        road: 'Đường Nguyễn Hữu Thọ',
        quarter: 'Quận 7',
        city: 'Hồ Chí Minh',
        country: 'Việt Nam',
        lat: '10.7369',
        lng: '106.7195'
      },
      images: [
        bd3,
        bd1,
        bd2,
      ],
      rating_star: 4.6,
      price: 9500000,
      rental: true,
      property: {
        bedroom: 2,
        bathroom: 2,
        floors: 1
      },
      status: 'available',
      likes: ['user2', 'user5', 'user8'],
      reviews: ['review12', 'review13'],
      user: {
        _id: 'user104',
        name: 'Trần Minh Quân',
        email: 'quan@example.com',
        phone: '0923456789'
      },
      distance: 3.4,
      createdAt: '2025-03-29T10:40:00',
      updatedAt: '2025-04-03T16:20:00',
    },
    {
      id: '8',
      name: 'Nhà phố liền kề khu đô thị Gamuda',
      address: {
        house_number: 156,
        road: 'Tam Trinh',
        quarter: 'Hoàng Mai',
        city: 'Hà Nội',
        country: 'Việt Nam',
        lat: '20.9789',
        lng: '105.8369'
      },
      images: [
        bd5,
        bd4,
        bd2,
        bd1,
      ],
      rating_star: 4.5,
      price: 14500000,
      rental: true,
      property: {
        bedroom: 4,
        bathroom: 3,
        floors: 3
      },
      status: 'pending',
      likes: ['user6', 'user9', 'user12'],
      reviews: ['review14'],
      user: {
        _id: 'user105',
        name: 'Nguyễn Lan Anh',
        email: 'lananh@example.com',
        phone: '0934567890'
      },
      distance: 7.2,
      createdAt: '2025-04-02T11:15:00',
      updatedAt: '2025-04-04T09:30:00',
    },
    {
      id: '9',
      name: 'Homestay view đồi Phú Quốc',
      address: {
        house_number: 23,
        road: 'Đường Bãi Trường',
        quarter: 'Dương Tơ',
        city: 'Phú Quốc',
        country: 'Việt Nam',
        lat: '10.1678',
        lng: '103.9931'
      },
      images: [
        bd6,
        bd8,
        bd7,
        bd3,
      ],
      rating_star: 4.9,
      price: 5500000,
      rental: true,
      property: {
        bedroom: 2,
        bathroom: 1,
        floors: 1
      },
      status: 'available',
      likes: ['user1', 'user4', 'user7', 'user10', 'user13', 'user14'],
      reviews: ['review15', 'review16', 'review17', 'review18', 'review19'],
      user: {
        _id: 'user106',
        name: 'Lê Văn Đức',
        email: 'duc@example.com',
        phone: '0945678901'
      },
      distance: 0.3,
      createdAt: '2025-03-20T08:45:00',
      updatedAt: '2025-04-01T16:30:00',
    },
    {
      id: '10',
      name: 'Căn hộ cao cấp Times City',
      address: {
        house_number: 458,
        road: 'Minh Khai',
        quarter: 'Hai Bà Trưng',
        city: 'Hà Nội',
        country: 'Việt Nam',
        lat: '20.9952',
        lng: '105.8658'
      },
      images: [
        bd2,
        bd1,
        bd4,
      ],
      rating_star: 4.3,
      price: 11000000,
      rental: true,
      property: {
        bedroom: 3,
        bathroom: 2,
        floors: 1
      },
      status: 'booked',
      likes: ['user3', 'user8', 'user15'],
      reviews: ['review20', 'review21'],
      user: {
        _id: 'user107',
        name: 'Phạm Minh Tuấn',
        email: 'tuan@example.com',
        phone: '0956789012'
      },
      distance: 4.1,
      createdAt: '2025-03-28T15:20:00',
      updatedAt: '2025-04-03T11:45:00',
    }
  ]);

  // Filter posts based on current tab
  const getFilteredEstates = () => {
    if (activeTab === 'all') return estates;
    return estates.filter(estate => {
      if (activeTab === 'available') return estate.status === 'available';
      if (activeTab === 'pending') return estate.status === 'pending';
      if (activeTab === 'booked') return estate.status === 'booked';
      return true;
    });
  };

  // Get current items for pagination
  const getCurrentItems = () => {
    const filteredEstates = getFilteredEstates();
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredEstates.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Total pages calculation
  const totalPages = Math.ceil(getFilteredEstates().length / ITEMS_PER_PAGE);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Show post details
  const openEstateDetail = (estate) => {
    setSelectedEstate(estate);
    setShowDetailModal(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' VNĐ';
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

  // Handle edit action from the detail modal
  const handleEditEstate = (estate) => {
    setSelectedEstate(estate);
    setShowDetailModal(false);
    setShowEditForm(true);
  };

  // Handle save from edit form
  const handleSaveEstate = (updatedEstate) => {
    const updatedEstates = estates.map(estate => 
      estate.id === updatedEstate.id ? {...updatedEstate, updatedAt: new Date().toISOString()} : estate
    );
    setEstates(updatedEstates);
    setShowEditForm(false);
  };

  // Handle delete action
  const handleDeleteEstate = (estateId) => {
    const updatedEstates = estates.filter(estate => estate.id !== estateId);
    setEstates(updatedEstates);
  };

  // Handle approve action
  const handleApproveEstate = (estateId) => {
    const updatedEstates = estates.map(estate => 
      estate.id === estateId ? {...estate, status: 'available', updatedAt: new Date().toISOString()} : estate
    );
    setEstates(updatedEstates);
  };

  // Create new estate
  const handleCreateEstate = () => {
    setSelectedEstate(null); // No estate selected means creating new
    setShowEditForm(true);
  };

  // Handle save for new estate
  const handleSaveNewEstate = (newEstate) => {
    const newId = (Math.max(...estates.map(e => parseInt(e.id))) + 1).toString();
    const now = new Date().toISOString();
    
    const estateToAdd = {
      ...newEstate,
      id: newId,
      createdAt: now,
      updatedAt: now,
      likes: [],
      reviews: [],
      rating_star: 0,
      user: {
        _id: 'user999', // This would be the current user in a real app
        name: 'Người dùng hiện tại',
        email: 'current@example.com',
        phone: '0912345678'
      }
    };
    
    setEstates([...estates, estateToAdd]);
    setShowEditForm(false);
  };

  // Function to safely get the last part of a user's name or a default value
  const getUserLastName = (estate) => {
    if (!estate || !estate.user || !estate.user.name) {
      return 'N/A'; // Return a default value if user or name is not available
    }
    try {
      return estate.user.name.split(' ').pop();
    } catch (error) {
      return 'N/A'; // Return default value in case of any error during splitting
    }
  };

  return (
    <div className="estate-management">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Quản lý bài đăng bất động sản</h1>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm bài đăng..."
                className="search-input"
              />
              <Search className="search-icon" size={18} />
            </div>
            <button className="btn btn-create" onClick={handleCreateEstate}>
              <PlusCircle className="mr-2" size={18} /> Tạo mới
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="stats-label">Tổng bài đăng</p>
                <h3 className="stats-value">{estates.length}</h3>
              </div>
              <div className="stats-icon-container blue">
                <FileText className="stats-icon" />
              </div>
            </div>
            <div className="stats-trend positive">
              +8.2% so với tháng trước
            </div>
          </div>
          
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="stats-label">Đã duyệt</p>
                <h3 className="stats-value">{estates.filter(e => e.status === 'available').length}</h3>
              </div>
              <div className="stats-icon-container green">
                <CheckCircle className="stats-icon" />
              </div>
            </div>
            <div className="stats-trend positive">
              +12.5% so với tháng trước
            </div>
          </div>
          
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="stats-label">Đã đặt</p>
                <h3 className="stats-value">{estates.filter(e => e.status === 'booked').length}</h3>
              </div>
              <div className="stats-icon-container blue">
                <Flag className="stats-icon" />
              </div>
            </div>
            <div className="stats-trend positive">
              +15.3% so với tháng trước
            </div>
          </div>
          
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="stats-label">Chờ duyệt</p>
                <h3 className="stats-value">{estates.filter(e => e.status === 'pending').length}</h3>
              </div>
              <div className="stats-icon-container yellow">
                <Clock className="stats-icon" />
              </div>
            </div>
            <div className="stats-trend negative">
              +7.8% so với tháng trước
            </div>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="filter-container">
          <div className="filter-tabs">
            <button
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
              className={`filter-tab ${activeTab === 'all' ? 'filter-tab-active filter-tab-blue' : ''}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => {
                setActiveTab('available');
                setCurrentPage(1);
              }}
              className={`filter-tab ${activeTab === 'available' ? 'filter-tab-active filter-tab-green' : ''}`}
            >
              Có sẵn
            </button>
            <button
              onClick={() => {
                setActiveTab('pending');
                setCurrentPage(1);
              }}
              className={`filter-tab ${activeTab === 'pending' ? 'filter-tab-active filter-tab-yellow' : ''}`}
            >
              Chờ duyệt
            </button>
            <button
              onClick={() => {
                setActiveTab('booked');
                setCurrentPage(1);
              }}
              className={`filter-tab ${activeTab === 'booked' ? 'filter-tab-active filter-tab-blue' : ''}`}
            >
              Đã đặt
            </button>
          </div>
          <button className="btn btn-filter">
            <Filter size={16} className="mr-2" /> Lọc nâng cao
          </button>
        </div>

        {/* Estates Grid */}
        <div className="estates-grid">
          {getCurrentItems().map((estate) => (
            <div key={estate.id} className="estate-card">
              <div className="estate-card-image-container">
                <img 
                  src={estate.images[0]} 
                  alt={estate.name}
                  className="estate-card-image"
                />
                <div className="estate-card-status">
                  {renderStatus(estate.status)}
                </div>
              </div>
              <div className="estate-card-content">
                <h3 className="estate-card-title">{estate.name}</h3>
                <div className="estate-card-address">
                  <MapPin size={16} className="icon-small" />
                  <p>{estate.address.road}, {estate.address.quarter}, {estate.address.city}</p>
                </div>
                
                <div className="estate-card-stats">
                  <div className="estate-card-rating">
                    <Star size={16} className="mr-1" />
                    <span>{estate.rating_star}</span>
                  </div>
                  <div className="estate-card-price">{formatCurrency(estate.price)}</div>
                </div>
                
                <div className="estate-card-features">
                  <div className="estate-card-feature">
                    <Bed size={16} className="mr-1" />
                    <span>{estate.property.bedroom}</span>
                  </div>
                  <div className="estate-card-feature">
                    <Bath size={16} className="mr-1" />
                    <span>{estate.property.bathroom}</span>
                  </div>
                  <div className="estate-card-feature">
                    <Home size={16} className="mr-1" />
                    <span>{getUserLastName(estate)}</span>
                  </div>
                </div>
                
                <div className="estate-card-actions">
                  <button 
                    onClick={() => openEstateDetail(estate)}
                    className="btn btn-view"
                  >
                    <Eye size={14} className="mr-1" /> Xem chi tiết
                  </button>
                  {estate.status === 'pending' && (
                    <button 
                      className="btn btn-approve" 
                      onClick={() => handleApproveEstate(estate.id)}
                    >
                      <CheckCircle size={14} className="mr-1" /> Duyệt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị <span className="pagination-info-bold">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span> đến <span className="pagination-info-bold">
              {Math.min(currentPage * ITEMS_PER_PAGE, getFilteredEstates().length)}
            </span> của <span className="pagination-info-bold">{getFilteredEstates().length}</span> bài đăng
          </div>
          <nav className="pagination-nav">
            <button 
              className="pagination-btn" 
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? 'pagination-btn-active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </nav>
        </div>
      </main>
      
      {/* Estate Detail Modal */}
      {showDetailModal && selectedEstate && 
        <EstateDetailModal 
          estate={selectedEstate} 
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEditEstate}
          onDelete={handleDeleteEstate}
          onApprove={handleApproveEstate}
        />
      }

      {/* Estate Edit Form */}
      {showEditForm && 
        <EstateEditForm 
          estate={selectedEstate}
          isNew={!selectedEstate}
          onClose={() => setShowEditForm(false)}
          onSave={selectedEstate ? handleSaveEstate : handleSaveNewEstate}
        />
      }
    </div>
  );
};

export default EstateManagement;