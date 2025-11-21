import { useEffect, useMemo, useState } from 'react';
import ProductFilters from './ProductFilters';
import ImportExportBar from './ImportExportBar';
import ProductTable from './ProductTable';
import PaginationControls from './PaginationControls';
import InventoryHistorySidebar from './InventoryHistorySidebar';
import ProductFormModal from './ProductFormModal';
import useProducts from '../../hooks/useProducts';
import productsApi from '../../api/productsApi';
import '../../styles/products.css';

const DEFAULT_LIMIT = 10;

function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);

  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formProduct, setFormProduct] = useState(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const {
    data: products,
    pagination,
    setParams,
    loading,
    error,
    refresh,
  } = useProducts({
    search,
    category,
    page,
    limit: DEFAULT_LIMIT,
    sort,
    order,
  });

  useEffect(() => {
    setParams({
      search,
      category,
      page,
      limit: DEFAULT_LIMIT,
      sort,
      order,
    });
  }, [search, category, page, sort, order, setParams]);

  useEffect(() => {
    if (!isHistoryOpen || !historyProduct) {
      return;
    }
    async function fetchHistory() {
      setHistoryLoading(true);
      setHistoryError('');
      try {
        const response = await productsApi.getProductHistory(historyProduct.id);
        setHistory(response);
      } catch (err) {
        setHistoryError(
          err.response?.data?.error || 'Failed to load inventory history'
        );
      } finally {
        setHistoryLoading(false);
      }
    }
    fetchHistory();
  }, [isHistoryOpen, historyProduct]);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.category) {
        set.add(product.category);
      }
    });
    return Array.from(set);
  }, [products]);

  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleSortChange = (field) => {
    setSort((prevSort) => {
      if (prevSort === field) {
        setOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return prevSort;
      }
      setOrder('asc');
      return field;
    });
    setPage(1);
  };

  const handleImport = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('csvFile', file);
    try {
      const result = await productsApi.importProducts(formData);
      showNotification(
        `Import complete. Added ${result.added}, skipped ${result.skipped}.`
      );
      refresh();
    } catch (err) {
      showNotification(
        err.response?.data?.error || 'Failed to import CSV',
        'error'
      );
    }
  };

  const handleExport = async () => {
    try {
      const blob = await productsApi.exportProducts();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showNotification(
        err.response?.data?.error || 'Failed to export CSV',
        'error'
      );
    }
  };

  const handleInlineEdit = async (id, values) => {
    try {
      await productsApi.updateProduct(id, values);
      showNotification('Product updated');
      refresh();
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to update product';
      showNotification(message, 'error');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    try {
      await productsApi.deleteProduct(id);
      showNotification('Product deleted');
      refresh();
    } catch (err) {
      showNotification(
        err.response?.data?.error || 'Failed to delete product',
        'error'
      );
    }
  };

  const handleFormSave = async (values) => {
    try {
      if (formProduct) {
        await productsApi.updateProduct(formProduct.id, values);
        showNotification('Product updated');
      } else {
        await productsApi.createProduct(values);
        showNotification('Product created');
      }
      setIsFormOpen(false);
      setFormProduct(null);
      refresh();
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to save product';
      showNotification(message, 'error');
      throw err;
    }
  };

  const handleViewHistory = (product) => {
    setHistoryProduct(product);
    setIsHistoryOpen(true);
  };

  const handleAddProduct = () => {
    setFormProduct(null);
    setIsFormOpen(true);
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="products-page">
      <div className="products-toolbar">
        <ProductFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          category={category || 'All'}
          onCategoryChange={(value) => {
            setCategory(value === 'All' ? '' : value);
            setPage(1);
          }}
          categoryOptions={categoryOptions}
          onAddClick={handleAddProduct}
        />
        <ImportExportBar onImport={handleImport} onExport={handleExport} />
      </div>

      {notification && (
        <div className={`inline-alert ${notificationType}`}>
          {notification}
        </div>
      )}

      <ProductTable
        products={products}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
        onEdit={handleInlineEdit}
        onDelete={handleDelete}
        onViewHistory={handleViewHistory}
        loading={loading}
        error={error || ''}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setPage(newPage);
        }}
      />

      <InventoryHistorySidebar
        isOpen={isHistoryOpen}
        product={historyProduct}
        history={history}
        loading={historyLoading}
        error={historyError}
        onClose={() => setIsHistoryOpen(false)}
      />

      <ProductFormModal
        isOpen={isFormOpen}
        initialData={formProduct}
        onClose={() => {
          setIsFormOpen(false);
          setFormProduct(null);
        }}
        onSave={handleFormSave}
      />
    </div>
  );
}

export default ProductsPage;

