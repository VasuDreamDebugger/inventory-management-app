import PropTypes from 'prop-types';

function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
  onAddClick,
}) {
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
      <button type="button" className="primary-btn" onClick={onAddClick}>
        Add Product
      </button>
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
};

export default ProductFilters;

