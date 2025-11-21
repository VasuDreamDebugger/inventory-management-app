import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const defaultState = {
  name: '',
  unit: '',
  category: '',
  brand: '',
  stock: 0,
  status: '',
  image: '',
};

function ProductFormModal({ isOpen, initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(defaultState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        unit: initialData.unit || '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        stock: initialData.stock ?? 0,
        status: initialData.status || '',
        image: initialData.image || '',
      });
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (!formData.name.trim()) {
        setError('Product name is required');
        setSaving(false);
        return;
      }
      await onSave(formData);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Unable to save product'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Product' : 'Add Product'}</h3>
          <button type="button" className="link-button light" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label htmlFor="name">
            <span>Name</span>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </label>
          <label htmlFor="category">
            <span>Category</span>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={saving}
            />
          </label>
          <label htmlFor="brand">
            <span>Brand</span>
            <input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              disabled={saving}
            />
          </label>
          <label htmlFor="unit">
            <span>Unit</span>
            <input
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              disabled={saving}
            />
          </label>
          <label htmlFor="stock">
            <span>Stock</span>
            <input
              id="stock"
              type="number"
              min={0}
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              disabled={saving}
            />
          </label>
          <label htmlFor="status">
            <span>Status</span>
            <input
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={saving}
            />
          </label>
          <label htmlFor="image">
            <span>Image URL</span>
            <input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              disabled={saving}
            />
          </label>

          {error && <div className="auth-alert error">{error}</div>}

          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

ProductFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

ProductFormModal.defaultProps = {
  initialData: null,
};

export default ProductFormModal;

