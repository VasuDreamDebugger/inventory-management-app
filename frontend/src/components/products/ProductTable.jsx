import PropTypes from 'prop-types';
import ProductRow from './ProductRow';

function SortableHeader({ label, field, sort, order, onSortChange }) {
  const isActive = sort === field;
  const direction = isActive && order === 'asc' ? '↑' : '↓';
  return (
    <button
      type="button"
      className={`sortable-header ${isActive ? 'active' : ''}`}
      onClick={() => onSortChange(field)}
    >
      {label}
      <span className="sort-indicator">{isActive ? direction : ''}</span>
    </button>
  );
}

SortableHeader.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

function ProductTable({
  products,
  sort,
  order,
  onSortChange,
  onEdit,
  onDelete,
  onViewHistory,
  loading,
  error,
}) {
  return (
    <section className="product-table">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <SortableHeader
                  label="Name"
                  field="name"
                  sort={sort}
                  order={order}
                  onSortChange={onSortChange}
                />
              </th>
              <th>
                <SortableHeader
                  label="Category"
                  field="category"
                  sort={sort}
                  order={order}
                  onSortChange={onSortChange}
                />
              </th>
              <th>Brand</th>
              <th>Unit</th>
              <th>
                <SortableHeader
                  label="Stock"
                  field="stock"
                  sort={sort}
                  order={order}
                  onSortChange={onSortChange}
                />
              </th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="table-status">
                  Loading products…
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={7} className="table-status error">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && products.length === 0 && (
              <tr>
                <td colSpan={7} className="table-status">
                  No products found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewHistory={onViewHistory}
                />
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

ProductTable.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  sort: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewHistory: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

ProductTable.defaultProps = {
  error: '',
};

export default ProductTable;

