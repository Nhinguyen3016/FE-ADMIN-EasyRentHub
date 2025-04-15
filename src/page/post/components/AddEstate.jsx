import React, { useState } from 'react';
import { ChevronLeft, Upload, X, Plus, Save } from 'lucide-react';
import '../../../styles/post/components/AddEstate.css';

const AddEstate = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      lat: 40.7128,
      lng: -74.0060
    },
    price: 0,
    status: 'pending',
    property: {
      type: 'apartment',
      bedrooms: 1,
      bathrooms: 1,
      floors: 1,
      area: 0,
      amenities: ['standard'],
      description: ''
    },
    description: '',
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

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
      newErrors.name = 'Property name is required';
    }

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street is required';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    // Allow form submission without images during testing
    // if (previewImages.length === 0) {
    //   newErrors.images = 'At least one image is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmissionError('');
      
      try {
        // Get token from localStorage if needed
        const token = localStorage.getItem('token');
        
        // Use hardcoded sample data
        const sampleData = {
          "name": "Sunshine Apartment",
          "images": [
            "https://example.com/images/apartment1.jpg",
            "https://example.com/images/apartment2.jpg"
          ],
          "address": {
            "street": "123 Main Street",
            "city": "New York",
            "state": "NY",
            "zipCode": "10001",
            "country": "USA",
            "lat": 40.7128,
            "lng": -74.0060
          },
          "price": 1500,
          "property": {
            "type": "apartment",
            "bedrooms": 2,
            "bathrooms": 1,
            "area": 85,
            "amenities": ["gym", "pool", "parking"],
            "description": "Beautiful modern apartment in downtown area"
          }
        };
        
        console.log('Submitting estate data:', JSON.stringify(sampleData, null, 2));
        
        const response = await fetch('http://localhost:5000/api/estates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(sampleData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(data.message || data.msg || 'Error creating property listing');
        }
        
        setIsSubmitting(false);
        onSave(data.newEstate || data.estate || data);
      } catch (error) {
        console.error('Error creating estate:', error);
        setSubmissionError(error.message || 'An error occurred while submitting. Please try again later.');
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('.input-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  };

  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <div className="edit-form-header">
          <h2 className="edit-form-title">
            Add New Property
          </h2>
          <button onClick={onClose} className="edit-form-close-btn">
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          {submissionError && (
            <div className="error-banner">{submissionError}</div>
          )}
          
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Property Name</label>
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
                <label htmlFor="price">Price ($)</label>
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
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Address</h3>
            
            <div className="form-group">
              <label htmlFor="address.street">Street</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className={errors['address.street'] ? 'input-error' : ''}
              />
              {errors['address.street'] && (
                <div className="error-message">{errors['address.street']}</div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
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
              
              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address.zipCode">Zip Code</label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address.country">Country</label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
              />
            </div>
            
            {/* Hidden fields for coordinates */}
            <input type="hidden" name="address.lat" value={formData.address.lat} />
            <input type="hidden" name="address.lng" value={formData.address.lng} />
          </div>

          <div className="form-section">
            <h3 className="section-title">Property Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="property.bedrooms">Bedrooms</label>
                <input
                  type="number"
                  id="property.bedrooms"
                  name="property.bedrooms"
                  min="0"
                  value={formData.property.bedrooms}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property.bathrooms">Bathrooms</label>
                <input
                  type="number"
                  id="property.bathrooms"
                  name="property.bathrooms"
                  min="0"
                  value={formData.property.bathrooms}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property.floors">Floors</label>
                <input
                  type="number"
                  id="property.floors"
                  name="property.floors"
                  min="1"
                  value={formData.property.floors}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property.type">Property Type</label>
                <select
                  id="property.type"
                  name="property.type"
                  value={formData.property.type}
                  onChange={handleChange}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="property.area">Area (sq ft)</label>
                <input
                  type="number"
                  id="property.area"
                  name="property.area"
                  min="1"
                  value={formData.property.area}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="property.description">Property Description</label>
              <textarea
                id="property.description"
                name="property.description"
                rows="5"
                value={formData.property.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Images</h3>
            
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
                  <span>Upload Images</span>
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
            <button type="button" className="btn btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-save" disabled={isSubmitting}>
              <Save size={16} className="btn-icon" />
              {isSubmitting ? 'Processing...' : 'Create Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEstate;