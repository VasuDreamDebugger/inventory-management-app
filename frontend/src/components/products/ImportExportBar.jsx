import PropTypes from 'prop-types';
import { useRef } from 'react';

function ImportExportBar({ onImport, onExport }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = '';
    }
  };

  return (
    <section className="import-export-bar">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="secondary-btn"
        onClick={() => fileInputRef.current?.click()}
      >
        Import CSV
      </button>
      <button type="button" className="secondary-btn" onClick={onExport}>
        Export CSV
      </button>
    </section>
  );
}

ImportExportBar.propTypes = {
  onImport: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default ImportExportBar;

