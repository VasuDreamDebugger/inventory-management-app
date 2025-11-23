import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
  onAddClick,
  onImport,
  onExport,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = '';
    }
  };

  return (
    <section className="product-filters">
      <div className="filter-group">
        <label htmlFor="search">
          <span>Search</span>
          <input
            id="search"
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <label htmlFor="category">
          <span>Category</span>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="All">All</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      
      <div className="filter-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={handleFileChange}
        />
         <button type="button" className="stats-btn-filter" onClick={() => navigate('/stats')}>
          📊 Statistics
        </button>
        <button
          type="button"
          className="import-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Import CSV
        </button>
        <button type="button" className="export-btn" onClick={onExport}>
          Export CSV
        </button>
       
        <button type="button" className="primary-btn" onClick={onAddClick}>
          Add Product
        </button>
      </div>
    </section>
  );
}

ProductFilters.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  categoryOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddClick: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ProductFilters;

