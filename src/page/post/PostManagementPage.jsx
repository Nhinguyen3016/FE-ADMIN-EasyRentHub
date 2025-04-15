import '../../styles/post/PostManagement.css';
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Filter, CheckCircle, AlertCircle, Clock, Home, Eye, Flag, MapPin, Star, Bed, Bath } from 'lucide-react';
import EstateDetailModal from './components/EstateDetailModal'; 
import EstateEditForm from './components/EstateEditForm';
import { FileText } from "lucide-react";
import bd1 from '../../images/bd1.jpg';

const EstateManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/estates`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.msg === "Success!" && Array.isArray(data.estates)) {
          const transformedEstates = data.estates.map(estate => ({
            id: estate._id,
            name: estate.name,
            address: estate.address,
            images: estate.images && estate.images.length > 0 ? estate.images : [bd1], 
            rating_star: 4.5, 
            price: estate.price || 0,
            rental: true, 
            property: estate.property,
            status: estate.status,
            likes: estate.likes || [],
            reviews: estate.reviews || [],
            user: typeof estate.user === 'object' ? estate.user : { _id: estate.user, name: 'Unknown User' },
            distance: 1.0, 
            createdAt: estate.createdAt,
            updatedAt: estate.updatedAt,
          }));
          
          setEstates(transformedEstates);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching estates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstates();
  }, []);

  const getFilteredEstates = () => {
    if (activeTab === 'all') return estates;
    return estates.filter(estate => {
      if (activeTab === 'available') return estate.status === 'available';
      if (activeTab === 'pending') return estate.status === 'pending';
      if (activeTab === 'booked') return estate.status === 'booked';
      return true;
    });
  };

  const getCurrentItems = () => {
    const filteredEstates = getFilteredEstates();
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredEstates.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalPages = Math.ceil(getFilteredEstates().length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openEstateDetail = (estate) => {
    setSelectedEstate(estate);
    setShowDetailModal(true);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' VNĐ';
  };

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

  const handleEditEstate = (estate) => {
    setSelectedEstate(estate);
    setShowDetailModal(false);
    setShowEditForm(true);
  };

  
  const handleSaveEstate = async (updatedEstate) => {
    try {

      if (!updatedEstate.id) {
        throw new Error('Estate ID is missing');
      }
      

      const token = localStorage.getItem('token');
      

      const apiData = {
        name: updatedEstate.name,
        listType: updatedEstate.listType,
        address: updatedEstate.address,
        price: updatedEstate.price,
        property: updatedEstate.property,
        images: updatedEstate.images
      };
      
     
      const response = await fetch(`${API_BASE_URL}/estate/${updatedEstate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {

        const errorData = await response.json().catch(() => null);
        throw new Error(`HTTP error! Status: ${response.status}${errorData ? ` - ${errorData.message}` : ''}`);
      }
      

      const updatedEstates = estates.map(estate => 
        estate.id === updatedEstate.id ? {...updatedEstate, updatedAt: new Date().toISOString()} : estate
      );
      setEstates(updatedEstates);
      setShowEditForm(false);
    } catch (err) {
      console.error('Error updating estate:', err);
      alert(`Failed to update estate: ${err.message}`);
    }
  };

  const handleDeleteEstate = async (estateId) => {
    try {
      const token = localStorage.getItem('token');
      

      const response = await fetch(`${API_BASE_URL}/estate/${estateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedEstates = estates.filter(estate => estate.id !== estateId);
      setEstates(updatedEstates);
      setShowDetailModal(false);
    } catch (err) {
      console.error('Error deleting estate:', err);
      alert(`Failed to delete estate: ${err.message}`);
    }
  };

  const handleApproveEstate = async (estateId) => {
    try {
      const token = localStorage.getItem('token');
      

      const response = await fetch(`${API_BASE_URL}/estate/status/${estateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'available'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedEstates = estates.map(estate => 
        estate.id === estateId ? {...estate, status: 'available', updatedAt: new Date().toISOString()} : estate
      );
      setEstates(updatedEstates);
      

      if (showDetailModal && selectedEstate && selectedEstate.id === estateId) {
        setSelectedEstate({...selectedEstate, status: 'available'});
      }
    } catch (err) {
      console.error('Error approving estate:', err);
      alert(`Failed to approve estate: ${err.message}`);
    }
  };

  const handleCreateEstate = () => {
    setSelectedEstate(null); 
    setShowEditForm(true);
  };

  const handleSaveNewEstate = async (newEstate) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/estates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newEstate.name,
          price: newEstate.price,
          address: newEstate.address,
          property: newEstate.property,
          images: newEstate.images,
          status: 'pending',
          listType: newEstate.listType || 'rental'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const createdEstate = await response.json();
      
   
      const estateToAdd = {
        id: createdEstate._id || createdEstate.newEstate._id,
        name: createdEstate.name || createdEstate.newEstate.name,
        address: createdEstate.address || createdEstate.newEstate.address,
        images: (createdEstate.images || createdEstate.newEstate.images || []).length > 0 
          ? (createdEstate.images || createdEstate.newEstate.images) 
          : [bd1],
        rating_star: 0,
        price: (createdEstate.price || createdEstate.newEstate.price) || 0,
        rental: true,
        property: createdEstate.property || createdEstate.newEstate.property,
        status: createdEstate.status || createdEstate.newEstate.status,
        likes: [],
        reviews: [],
        user: typeof (createdEstate.user || createdEstate.newEstate.user) === 'object' 
          ? (createdEstate.user || createdEstate.newEstate.user) 
          : { _id: (createdEstate.user || createdEstate.newEstate.user), name: 'Current User' },
        distance: 1.0,
        createdAt: createdEstate.createdAt || createdEstate.newEstate.createdAt || new Date().toISOString(),
        updatedAt: createdEstate.updatedAt || createdEstate.newEstate.updatedAt || new Date().toISOString(),
      };
      
      setEstates([...estates, estateToAdd]);
      setShowEditForm(false);
    } catch (err) {
      console.error('Error creating estate:', err);
      alert(`Failed to create estate: ${err.message}`);
    }
  };

 
  const getUserLastName = (estate) => {
    if (!estate || !estate.user || !estate.user.name) {
      return 'N/A';
    }
    try {
      return estate.user.name.split(' ').pop();
    } catch (error) {
      return 'N/A';
    }
  };
  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu bất động sản...</p>
      </div>
    );
  }
  

  if (error) {
    return (
      <div className="error-container">
        <h2>Lỗi khi tải dữ liệu</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

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
          {getCurrentItems().length === 0 ? (
            <div className="no-estates-message">
              <p>Không có bài đăng bất động sản nào {activeTab !== 'all' ? `ở trạng thái "${activeTab}"` : ''}</p>
            </div>
          ) : (
            getCurrentItems().map((estate) => (
              <div key={estate.id} className="estate-card">
                <div className="estate-card-image-container">
                  <img 
                    src={estate.images[0]} 
                    alt={estate.name}
                    className="estate-card-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = bd1;
                    }}
                  />
                  <div className="estate-card-status">
                    {renderStatus(estate.status)}
                  </div>
                </div>
                <div className="estate-card-content">
                  <h3 className="estate-card-title">{estate.name}</h3>
                  <div className="estate-card-address">
                    <MapPin size={16} className="icon-small" />
                    <p>
                      {estate.address.road ? estate.address.road + ', ' : ''}
                      {estate.address.quarter ? estate.address.quarter + ', ' : ''}
                      {estate.address.city || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="estate-card-stats">
                    <div className="estate-card-rating">
                      <Star size={16} className="mr-1" />
                      <span>{estate.rating_star || 0}</span>
                    </div>
                    <div className="estate-card-price">{formatCurrency(estate.price || 0)}</div>
                  </div>
                  
                  <div className="estate-card-features">
                    <div className="estate-card-feature">
                      <Bed size={16} className="mr-1" />
                      <span>{estate.property?.bedroom || 0}</span>
                    </div>
                    <div className="estate-card-feature">
                      <Bath size={16} className="mr-1" />
                      <span>{estate.property?.bathroom || 0}</span>
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
            ))
          )}
        </div>
        
        {/* Pagination */}
        {estates.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Hiển thị <span className="pagination-info-bold">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, getFilteredEstates().length)}
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
        )}
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