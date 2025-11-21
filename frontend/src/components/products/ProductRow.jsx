import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

function ProductRow({ product, onEdit, onDelete, onViewHistory }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name || '',
    category: product.category || '',
    brand: product.brand || '',
    unit: product.unit || '',
    stock: product.stock ?? 0,
    status: product.status || '',
    image: product.image || '',
  });
  const [saving, setSaving] = useState(false);
  const [rowError, setRowError] = useState('');

  useEffect(() => {
    setFormData({
      name: product.name || '',
      category: product.category || '',
      brand: product.brand || '',
      unit: product.unit || '',
      stock: product.stock ?? 0,
      status: product.status || '',
      image: product.image || '',
    });
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setRowError('');
    try {
      await onEdit(product.id, formData);
      setIsEditing(false);
    } catch (err) {
      setRowError(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Failed to update product'
      );
    } finally {
      setSaving(false);
    }
  };

  const statusClass = formData.stock === 0 ? 'status-out' : 'status-in';

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
          />
        ) : (
          product.name
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={saving}
          />
        ) : (
          product.category || '—'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            disabled={saving}
          />
        ) : (
          product.brand || '—'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            disabled={saving}
          />
        ) : (
          product.unit || '—'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="stock"
            min={0}
            value={formData.stock}
            onChange={handleChange}
            disabled={saving}
          />
        ) : (
          product.stock
        )}
      </td>
      <td>
        <span className={`status-badge ${statusClass}`}>
          {formData.stock === 0 ? 'Out of Stock' : 'In Stock'}
        </span>
      </td>
      <td>
        <div className="table-actions">
          {rowError && <span className="row-error">{rowError}</span>}
          {isEditing ? (
            <>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleSave}
                disabled={saving}
              >
                Save
              </button>
              <button
                type="button"
                className="link-button light"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: product.name || '',
                    category: product.category || '',
                    brand: product.brand || '',
                    unit: product.unit || '',
                    stock: product.stock ?? 0,
                    status: product.status || '',
                    image: product.image || '',
                  });
                  setRowError('');
                }}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="action-btn action-btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="action-btn action-btn-delete"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
              <button
                type="button"
                className="action-btn action-btn-history"
                onClick={() => onViewHistory(product)}
              >
                History
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

ProductRow.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    brand: PropTypes.string,
    unit: PropTypes.string,
    stock: PropTypes.number.isRequired,
    status: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func.isRequired,
};

export default ProductRow;

