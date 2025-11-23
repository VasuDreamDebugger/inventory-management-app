import PropTypes from 'prop-types';

function InventoryHistorySidebar({
  isOpen,
  product,
  history,
  loading,
  error,
  onClose,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChangeType = (oldQty, newQty) => {
    if (newQty > oldQty) return 'increase';
    if (newQty < oldQty) return 'decrease';
    return 'no-change';
  };

  const getChangeAmount = (oldQty, newQty) => {
    const diff = newQty - oldQty;
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  return (
    <>
      {isOpen && (
        <div className="history-backdrop" onClick={onClose} aria-hidden="true" />
      )}
      <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="history-header">
        <div className="history-header-content">
          <h3 className="history-title">Inventory History</h3>
          {product && (
            <div className="history-product-info">
              <span className="history-product-name">{product.name}</span>
              <span className="history-product-category">{product.category}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="history-close-btn"
          onClick={onClose}
          aria-label="Close history"
        >
          ×
        </button>
      </div>
      <div className="history-body">
        {loading && (
          <div className="history-loading">
            <p>Loading history…</p>
          </div>
        )}
        {error && (
          <div className="history-error">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && history.length === 0 && (
          <div className="history-empty">
            <p>No history entries available.</p>
            <span>Changes to this product will appear here.</span>
          </div>
        )}
        {!loading &&
          !error &&
          history.map((entry) => {
            const changeType = getChangeType(
              entry.old_quantity,
              entry.new_quantity
            );
            const changeAmount = getChangeAmount(
              entry.old_quantity,
              entry.new_quantity
            );

            return (
              <div
                key={entry.id}
                className={`history-entry history-entry-${changeType}`}
              >
                <div className="history-entry-main">
                  <div className="history-quantity-change">
                    <div className="quantity-group">
                      <span className="quantity-label">Old Quantity</span>
                      <span className="quantity-value quantity-old">
                        {entry.old_quantity}
                      </span>
                    </div>
                    <div className="quantity-arrow">→</div>
                    <div className="quantity-group">
                      <span className="quantity-label">New Quantity</span>
                      <span className="quantity-value quantity-new">
                        {entry.new_quantity}
                      </span>
                    </div>
                    <div className={`change-badge change-${changeType}`}>
                      {changeAmount}
                    </div>
                  </div>
                  <div className="history-entry-details">
                    <div className="history-detail-item">
                      <span className="detail-icon">👤</span>
                      <span className="detail-label">Updated by:</span>
                      <span className="detail-value">{entry.user_info || 'System'}</span>
                    </div>
                    <div className="history-detail-item">
                      <span className="detail-icon">🕒</span>
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">
                        {formatDate(entry.change_date)}
                      </span>
                    </div>
                    <div className="history-detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(entry.change_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
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

