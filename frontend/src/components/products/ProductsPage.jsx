import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ProductFilters from './ProductFilters';
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
  const [categoryOptions, setCategoryOptions] = useState([]);

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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await productsApi.getCategories();
      setCategoryOptions(response.categories || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load categories', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  const fallbackCategories = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.category) {
        set.add(product.category);
      }
    });
    return Array.from(set);
  }, [products]);

  const combinedCategoryOptions =
    categoryOptions.length > 0 ? categoryOptions : fallbackCategories;

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
      toast.success(
        `Import complete. Added ${result.added}, skipped ${result.skipped}.`
      );
      refresh();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to import CSV');
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
      toast.success('Products exported successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to export CSV');
    }
  };

  const handleInlineEdit = async (id, values) => {
    try {
      await productsApi.updateProduct(id, values);
      toast.success('Product updated successfully');
      refresh();
      fetchCategories();
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to update product';
      toast.error(message);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    try {
      await productsApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      refresh();
      fetchCategories();
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Failed to delete product'
      );
    }
  };

  const handleFormSave = async (values) => {
    try {
      if (formProduct) {
        await productsApi.updateProduct(formProduct.id, values);
        toast.success('Product updated successfully');
      } else {
        await productsApi.createProduct(values);
        toast.success('Product created successfully');
      }
      setIsFormOpen(false);
      setFormProduct(null);
      refresh();
      fetchCategories();
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to save product';
      toast.error(message);
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
          categoryOptions={combinedCategoryOptions}
          onAddClick={handleAddProduct}
          onImport={handleImport}
          onExport={handleExport}
        />
      </div>

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

