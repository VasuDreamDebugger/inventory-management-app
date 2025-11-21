import PropTypes from 'prop-types';

function InventoryHistorySidebar({
  isOpen,
  product,
  history,
  loading,
  error,
  onClose,
}) {
  return (
    <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="history-header">
        <div>
          <h3>Inventory History</h3>
          {product && <p>{product.name}</p>}
        </div>
        <button type="button" className="link-button light" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="history-body">
        {loading && <p>Loading history…</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && history.length === 0 && (
          <p>No history entries.</p>
        )}
        {!loading &&
          !error &&
          history.map((entry) => (
            <div key={entry.id} className="history-entry">
              <div>
                <strong>
                  {entry.old_quantity} → {entry.new_quantity}
                </strong>
                <p className="history-meta">
                  {new Date(entry.change_date).toLocaleString()}
                </p>
              </div>
              <span className="history-user">{entry.user_info}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

InventoryHistorySidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  product: PropTypes.object,
  history: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

InventoryHistorySidebar.defaultProps = {
  product: null,
  error: '',
};

export default InventoryHistorySidebar;

