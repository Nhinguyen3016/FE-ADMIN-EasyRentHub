import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, CheckCircle, AlertCircle, Flag} from 'lucide-react';
import EstateDetailModal from './components/EstateDetailModal'; 
import EstateEditForm from './components/EstateEditForm';
import EstateCard from './components/EstateCard'; 
import { FileText } from "lucide-react";
import bd1 from '../../images/bd1.jpg';
import '../../styles/post/PostManagement.css';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const dropdownRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  };
  
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        setLoadingAuthors(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.users && Array.isArray(data.users)) {
          const landlords = data.users
            .filter(user => user.role === 'Landlord')
            .map(user => ({
              _id: user._id,
              full_name: user.fullName || user.full_name || user.name || 'Unknown User',
              email: user.email,
              role: user.role
            }));
          
          setAuthors(landlords);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching landlords:', err);
        addToast(`Không thể tải danh sách tác giả: ${err.message}`, 'error');
      } finally {
        setLoadingAuthors(false);
      }
    };
    
    const fetchEstates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/estates?limit=1000`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.msg === "Success!" && Array.isArray(data.estates)) {
          const transformedEstates = data.estates.map(estate => ({
            id: estate._id,
            _id: estate._id, 
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
        addToast(`Lỗi khi tải dữ liệu: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLandlords();
    fetchEstates();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAuthorDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterEstatesByAuthor = (authorId) => {
    if (!authorId) {
      return [...estates];
    }
    return estates.filter(estate => 
      estate.user && (estate.user._id === authorId)
    );
  };

  const handleAuthorChange = (authorId) => {
    setSelectedAuthor(authorId);
    setShowAuthorDropdown(false);
    setCurrentPage(1);
  };

  const getFilteredEstates = () => {
    let filtered = selectedAuthor ? filterEstatesByAuthor(selectedAuthor) : estates;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(estate => {
        if (activeTab === 'available') return estate.status !== 'booked'; 
        if (activeTab === 'booked') return estate.status === 'booked';
        return true;
      });
    }
  
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(estate => 
        estate.name.toLowerCase().includes(search) || 
        (estate.address && estate.address.city && estate.address.city.toLowerCase().includes(search)) ||
        (estate.user && estate.user.name && estate.user.name.toLowerCase().includes(search))
      );
    }
    
    return filtered;
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
    if (status === 'booked') {
      return (
        <span className="status-badge status-booked">
          <AlertCircle size={14} className="mr-1" /> Đã đặt
        </span>
      );
    } else {
      return (
        <span className="status-badge status-available">
          <CheckCircle size={14} className="mr-1" /> Có sẵn
        </span>
      );
    }
  };

  const handleEditEstate = (estate) => {
    setSelectedEstate(estate);
    setShowDetailModal(false);
    setShowEditForm(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSaveEstate = async (updatedEstate) => {
    try {
      const estateId = updatedEstate.id || updatedEstate._id;
      
      console.log('Estate update object:', updatedEstate);
      console.log('Estate ID found:', estateId);
      
      if (!estateId) {
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
      
      console.log(`Sending PATCH request to: ${API_BASE_URL}/estate/${estateId}`);
      
      const response = await fetch(`${API_BASE_URL}/estate/${estateId}`, {
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
        (estate.id === estateId || estate._id === estateId) 
          ? {...updatedEstate, id: estateId, _id: estateId, updatedAt: new Date().toISOString()} 
          : estate
      );
      
      setEstates(updatedEstates);
      setShowEditForm(false);
      addToast('Cập nhật bài đăng thành công');
      
      console.log('Estate updated successfully:', estateId);
    } catch (err) {
      console.error('Error updating estate:', err);
      addToast(`Không thể cập nhật bài đăng: ${err.message}`, 'error');
    }
  };

  const handleDeleteEstate = async (estateId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      console.log(`Attempting to delete estate with ID: ${estateId}`);
      
      const response = await fetch(`${API_BASE_URL}/estate/${estateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);
      
      if (!response.ok) {
        let errorMessage = `Lỗi ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          
          if (errorData.msg) {
            if (errorData.msg.includes("Cannot read properties of null")) {
              errorMessage = 'Lỗi server: Dữ liệu bài đăng không hợp lệ. Vui lòng liên hệ quản trị viên.';
            } else if (errorData.msg.includes("not found")) {
              errorMessage = 'Bài đăng không tồn tại hoặc đã được xóa.';
            } else if (errorData.msg.includes("permission") || errorData.msg.includes("unauthorized")) {
              errorMessage = 'Bạn không có quyền xóa bài đăng này.';
            } else {
              errorMessage = `Lỗi server: ${errorData.msg}`;
            }
          } else if (errorData.message) {
            errorMessage = `Lỗi: ${errorData.message}`;
          } else {
            errorMessage = `Lỗi HTTP ${response.status}: Không thể xóa bài đăng`;
          }
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
          try {
            const errorText = await response.text();
            console.log('Error response text:', errorText);
            if (errorText) {
              errorMessage = `Lỗi server: ${errorText}`;
            }
          } catch (textError) {
            console.log('Could not get error response text');
            errorMessage = `Lỗi HTTP ${response.status}: Không thể kết nối đến server`;
          }
        }
        
        throw new Error(errorMessage);
      }
     
      const updatedEstates = estates.filter(estate => estate.id !== estateId && estate._id !== estateId);
      setEstates(updatedEstates);
      setShowDetailModal(false);
      addToast('Xóa bài đăng thành công');
      
      console.log('Estate deleted successfully:', estateId);
    } catch (err) {
      console.error('Error deleting estate:', err);

      let userMessage = err.message;
      if (err.message.includes('Failed to fetch')) {
        userMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.message.includes('500')) {
        userMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      }
      
      addToast(userMessage, 'error');
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
        const errorData = await response.json().catch(() => null);
        throw new Error(`HTTP error! Status: ${response.status}${errorData ? ` - ${errorData.message}` : ''}`);
      }
      
      const updatedEstates = estates.map(estate => 
        (estate.id === estateId || estate._id === estateId) 
          ? {...estate, status: estate.status === 'booked' ? 'available' : estate.status, updatedAt: new Date().toISOString()} 
          : estate
      );
      
      setEstates(updatedEstates);
      addToast('Cập nhật trạng thái thành công');
      
      if (showDetailModal && selectedEstate && (selectedEstate.id === estateId || selectedEstate._id === estateId)) {
        setSelectedEstate({...selectedEstate, status: selectedEstate.status === 'booked' ? 'available' : selectedEstate.status});
      }
    } catch (err) {
      console.error('Error updating estate status:', err);
      addToast(`Không thể cập nhật trạng thái: ${err.message}`, 'error');
    }
  };

  const toggleAuthorDropdown = () => {
    setShowAuthorDropdown(!showAuthorDropdown);
  };

  const getSelectedAuthorName = () => {
    if (!selectedAuthor) return "Tất cả tác giả";
    const author = authors.find(a => a._id === selectedAuthor);
    return author ? author.full_name : "Tất cả tác giả";
  };

  const resetAuthorFilter = () => {
    setSelectedAuthor('');
    setCurrentPage(1);
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
      {/* Toast notifications container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="header-title">Quản lý bài đăng </h1>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm bài đăng..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="search-icon" size={18} />
            </div>
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
          </div>
          
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="stats-label">Có sẵn</p>
                <h3 className="stats-value">{estates.filter(e => e.status !== 'booked').length}</h3>
              </div>
              <div className="stats-icon-container green">
                <CheckCircle className="stats-icon" />
              </div>
            </div>

          </div>
          
          <div className="stats-card">
            <div className="stats-card-content">
              <div>
                <p className="stats-label">Đã đặt</p>
                <h3 className="stats-value">{estates.filter(e => e.status === 'booked').length}</h3>
              </div>
              <div className="stats-icon-container yellow">
                <Flag className="stats-icon" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter tabs and author filter */}
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
                setActiveTab('booked');
                setCurrentPage(1);
              }}
              className={`filter-tab ${activeTab === 'booked' ? 'filter-tab-active filter-tab-yellow' : ''}`}
            >
              Đã đặt
            </button>
          </div>
          <div className="filter-advanced" ref={dropdownRef}>
            <div className="filter-controls">
              {selectedAuthor && (
                <div className="selected-filter">
                  <span>Tác giả: {getSelectedAuthorName()}</span>
                  <button 
                    className="clear-filter"
                    onClick={resetAuthorFilter}
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="filter-dropdown-container">
                <button className="btn btn-filter" onClick={toggleAuthorDropdown}>
                  <Filter size={16} className="mr-2" /> Lọc tác giả
                </button>
                
                {showAuthorDropdown && (
                  <div className="author-dropdown">
                    <div className="author-dropdown-header">
                      {loadingAuthors && <div className="dropdown-loading">Đang tải tác giả...</div>}
                    </div>
                    <div className="author-dropdown-list">
                      <div 
                        className={`author-dropdown-item ${selectedAuthor === '' ? 'selected' : ''}`}
                        onClick={() => handleAuthorChange('')}
                      >
                        Tất cả tác giả
                      </div>
                      {authors.map(author => (
                        <div 
                          key={author._id} 
                          className={`author-dropdown-item ${selectedAuthor === author._id ? 'selected' : ''}`}
                          onClick={() => handleAuthorChange(author._id)}
                        >
                          {author.full_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estates Grid */}
        <div className="estates-grid">
          {getCurrentItems().length === 0 ? (
            <div className="no-estates-message">
              <p>Không có bài đăng nào {activeTab !== 'all' ? `ở trạng thái "${activeTab}"` : ''} {selectedAuthor ? 'của tác giả này' : ''} {searchTerm ? `khớp với từ khóa "${searchTerm}"` : ''}</p>
            </div>
          ) : (
            getCurrentItems().map((estate) => (
              <EstateCard
                key={estate.id}
                estate={estate}
                onView={openEstateDetail}
                onApprove={handleApproveEstate}
                formatCurrency={formatCurrency}
                renderStatus={renderStatus}
              />
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
                 &lt;&lt;
              </button>
              
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`pagination-btn ${currentPage === i + 1 ? 'pagination-btn-active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <>
                  <button 
                    onClick={() => paginate(1)}
                    className={`pagination-btn ${currentPage === 1 ? 'pagination-btn-active' : ''}`}
                  >
                    1
                  </button>
                  
                  {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page !== 1 && page !== totalPages && 
                           Math.abs(page - currentPage) <= 1)
                    .map(page => (
                      <button 
                        key={page}
                        onClick={() => paginate(page)}
                        className={`pagination-btn ${currentPage === page ? 'pagination-btn-active' : ''}`}
                      >
                        {page}
                      </button>
                    ))
                  }
                  
                  {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
                  
                  <button 
                    onClick={() => paginate(totalPages)}
                    className={`pagination-btn ${currentPage === totalPages ? 'pagination-btn-active' : ''}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button 
                className="pagination-btn" 
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                  &gt;&gt;
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

      {/* Estate Edit Form - Only for editing existing estates, not for creating new ones */}
      {showEditForm && selectedEstate && 
        <EstateEditForm 
          estate={selectedEstate}
          isNew={false}
          onClose={() => setShowEditForm(false)}
          onSave={handleSaveEstate}
        />
      }
    </div>
  );
};

export default EstateManagement;