import PropTypes from 'prop-types';

function PaginationControls({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination-controls">
      <button
        type="button"
        className="secondary-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="page-indicator">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="secondary-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

PaginationControls.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationControls;

