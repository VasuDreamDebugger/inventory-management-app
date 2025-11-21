import ProductFilters from './ProductFilters';
import ImportExportBar from './ImportExportBar';
import ProductTable from './ProductTable';
import PaginationControls from './PaginationControls';
import InventoryHistorySidebar from './InventoryHistorySidebar';
import ProductFormModal from './ProductFormModal';
import '../../styles/products.css';

function ProductsPage() {
  return (
    <div className="products-page">
      <div className="products-toolbar">
        <ProductFilters />
        <ImportExportBar />
      </div>
      <ProductTable />
      <PaginationControls />
      <InventoryHistorySidebar />
      <ProductFormModal />
    </div>
  );
}

export default ProductsPage;

