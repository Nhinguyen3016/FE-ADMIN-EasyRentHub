import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, X, Plus, Save } from 'lucide-react';
import '../../../styles/post/components/EstateEditForm.css';

const EstateEditForm = ({ estate, onClose, onSave, isNew = false }) => {
  const getInitialState = (estateData) => {
    return estateData ? {
      id: estateData.id || '',
      name: estateData.name || '',
      address: estateData.address || {
        house_number: '',
        road: '',
        quarter: '',
        city: '',
        country: 'Việt Nam'
      },
      price: estateData.price || 0,
      status: estateData.status || 'pending',
      property: estateData.property || {
        bedroom: 1,
        bathroom: 1,
        floors: 1
      },
      description: estateData.description || '',
      images: estateData.images || []
    } : {
      name: '',
      address: {
        house_number: '',
        road: '',
        quarter: '',
        city: '',
        country: 'Việt Nam'
      },
      price: 0,
      status: 'pending',
      property: {
        bedroom: 1,
        bathroom: 1,
        floors: 1
      },
      description: '',
      images: []
    };
  };

  const initialState = getInitialState(estate);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState(initialState.images);

  useEffect(() => {
    // Reset form when estate prop changes
    if (estate) {
      const newInitialState = getInitialState(estate);
      setFormData(newInitialState);
      setPreviewImages(estate.images || []);
    }
  }, [estate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: parseInt(value) || 0
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Create preview URLs
    const newPreviewImages = [...previewImages];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviewImages.push(reader.result);
        setPreviewImages([...newPreviewImages]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    if (index < imageFiles.length) {
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(index, 1);
      setImageFiles(newImageFiles);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên bài đăng không được để trống';
    }

    // Convert house_number to string before checking if it's empty
    const houseNumber = String(formData.address.house_number);
    if (!houseNumber || houseNumber.trim() === '') {
      newErrors['address.house_number'] = 'Số nhà không được để trống';
    }

    if (!formData.address.road.trim()) {
      newErrors['address.road'] = 'Tên đường không được để trống';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Thành phố không được để trống';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (previewImages.length === 0) {
      newErrors.images = 'Cần ít nhất 1 hình ảnh';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create submission data with file references
      const submissionData = {
        ...formData,
        images: previewImages,
        imageFiles: imageFiles // This will be handled by the API
      };
      
      onSave(submissionData);
    }
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <div className="edit-form-header">
          <h2 className="edit-form-title">
            {isNew ? 'Thêm bài đăng mới' : 'Chỉnh sửa bài đăng'}
          </h2>
          <button onClick={onClose} className="edit-form-close-btn">
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            
            <div className="form-group">
              <label htmlFor="name">Tên bài đăng</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Giá thuê (VNĐ)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  className={errors.price ? 'input-error' : ''}
                />
                {errors.price && <div className="error-message">{errors.price}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="available">Có sẵn</option>
                  <option value="booked">Đã đặt</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Địa chỉ</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.house_number">Số nhà</label>
                <input
                  type="text"
                  id="address.house_number"
                  name="address.house_number"
                  value={formData.address.house_number}
                  onChange={handleChange}
                  className={errors['address.house_number'] ? 'input-error' : ''}
                />
                {errors['address.house_number'] && (
                  <div className="error-message">{errors['address.house_number']}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="address.road">Đường</label>
                <input
                  type="text"
                  id="address.road"
                  name="address.road"
                  value={formData.address.road}
                  onChange={handleChange}
                  className={errors['address.road'] ? 'input-error' : ''}
                />
                {errors['address.road'] && (
                  <div className="error-message">{errors['address.road']}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.quarter">Quận/Huyện</label>
                <input
                  type="text"
                  id="address.quarter"
                  name="address.quarter"
                  value={formData.address.quarter}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address.city">Thành phố</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className={errors['address.city'] ? 'input-error' : ''}
                />
                {errors['address.city'] && (
                  <div className="error-message">{errors['address.city']}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.country">Quốc gia</label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Thông tin chi tiết</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="property.bedroom">Phòng ngủ</label>
                <input
                  type="number"
                  id="property.bedroom"
                  name="property.bedroom"
                  min="0"
                  value={formData.property.bedroom}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property.bathroom">Phòng tắm</label>
                <input
                  type="number"
                  id="property.bathroom"
                  name="property.bathroom"
                  min="0"
                  value={formData.property.bathroom}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property.floors">Tầng</label>
                <input
                  type="number"
                  id="property.floors"
                  name="property.floors"
                  min="1"
                  value={formData.property.floors}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Hình ảnh</h3>
            
            <div className="image-upload-container">
              <label className="image-upload-label">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="image-upload-input"
                />
                <div className="image-upload-button">
                  <Upload size={24} />
                  <span>Tải lên hình ảnh</span>
                </div>
              </label>
              
              {errors.images && <div className="error-message">{errors.images}</div>}
              
              <div className="image-preview-container">
                {previewImages.map((src, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={src} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                <label className="image-add-button">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                  <Plus size={24} />
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-save">
              <Save size={16} className="mr-2" />
              {isNew ? 'Thêm bài đăng' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstateEditForm;