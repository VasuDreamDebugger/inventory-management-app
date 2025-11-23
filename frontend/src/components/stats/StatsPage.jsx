import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import productsApi from '../../api/productsApi';
import '../../styles/stats.css';

function StatCard({ title, value, subtitle, icon, color, onClick }) {
  return (
    <div
      className={`stat-card stat-card-${color}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <h3 className="stat-card-title">{title}</h3>
        <p className="stat-card-value">{value}</p>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

function CategoryBar({ category, stock, percentage, productCount }) {
  return (
    <div className="category-bar-item">
      <div className="category-bar-header">
        <div className="category-header-left">
          <span className="category-name">{category}</span>
          <span className="category-label">Total Stock Units</span>
        </div>
        <div className="category-header-right">
          <span className="category-stock">{stock.toLocaleString()}</span>
          <span className="category-unit-label">units</span>
        </div>
      </div>
      <div className="category-bar-container">
        <div
          className="category-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="category-bar-footer">
        <div className="category-footer-item">
          <span className="category-footer-label">Stock Share</span>
          <span className="category-percentage">{percentage}%</span>
        </div>
        <div className="category-footer-item">
          <span className="category-footer-label">Number of Products</span>
          <span className="category-count">{productCount}</span>
        </div>
      </div>
    </div>
  );
}

function ProductListItem({ product, index, type }) {
  return (
    <div className="product-list-item">
      <div className="product-list-rank">#{index + 1}</div>
      <div className="product-list-info">
        <span className="product-list-name">{product.name}</span>
        <span className="product-list-category">{product.category}</span>
      </div>
      <div className="product-list-value">
        {type === 'stock' ? (
          <span className="stock-value">{product.stock.toLocaleString()}</span>
        ) : (
          <span className="update-count">{product.updateCount} updates</span>
        )}
      </div>
    </div>
  );
}

function AlertItem({ product, type }) {
  return (
    <div className={`alert-item alert-${type}`}>
      <div className="alert-icon">
        {type === 'low' ? '⚠️' : '🚨'}
      </div>
      <div className="alert-content">
        <span className="alert-product-name">{product.name}</span>
        <span className="alert-category">{product.category}</span>
      </div>
      {type === 'low' && (
        <span className="alert-stock">{product.stock} left</span>
      )}
    </div>
  );
}

function StatsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productsApi.getStatistics();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stats-page">
        <div className="stats-loading">
          <div className="loading-spinner" />
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="stats-error">
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchStatistics}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="stats-page">
      <div className="stats-header">
        <div className="stats-header-content">
          <h1 className="stats-title">Inventory Insights</h1>
          <p className="stats-subtitle">
            Comprehensive overview of your inventory management
          </p>
        </div>
        <button
          className="back-to-products-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Products
        </button>
      </div>

      {/* Overview Cards */}
      <div className="stats-section">
        <h2 className="section-title">Overview</h2>
        <div className="stats-grid">
          <StatCard
            title="Total Products"
            value={stats.overview.totalProducts.toLocaleString()}
            subtitle="Active items in inventory"
            icon="📦"
            color="blue"
            onClick={() => navigate('/')}
          />
          <StatCard
            title="Total Stock"
            value={stats.overview.totalStock.toLocaleString()}
            subtitle="Units across all products"
            icon="📊"
            color="green"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.overview.lowStockCount}
            subtitle="Items with stock ≤ 10"
            icon="⚠️"
            color="orange"
            onClick={() => {
              const lowStockSection = document.getElementById('alerts-section');
              lowStockSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <StatCard
            title="Out of Stock"
            value={stats.overview.outOfStockCount}
            subtitle="Items needing restock"
            icon="🚨"
            color="red"
            onClick={() => {
              const alertsSection = document.getElementById('alerts-section');
              alertsSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="stats-section">
        <h2 className="section-title">Stock by Category</h2>
        <div className="category-breakdown">
          {stats.stockByCategory.map((item) => (
            <CategoryBar
              key={item.category}
              category={item.category}
              stock={item.totalStock}
              percentage={parseFloat(item.percentage)}
              productCount={item.productCount}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stats-section">
        <h2 className="section-title">Recent Activity (Last 7 Days)</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-icon">🔄</div>
            <div className="activity-content">
              <span className="activity-label">Total Updates</span>
              <span className="activity-value">
                {stats.recentActivity.updatesLast7Days}
              </span>
            </div>
          </div>
          <div className="activity-card activity-increase">
            <div className="activity-icon">📈</div>
            <div className="activity-content">
              <span className="activity-label">Stock Increased</span>
              <span className="activity-value">
                +{stats.recentActivity.stockIncrease.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="activity-card activity-decrease">
            <div className="activity-icon">📉</div>
            <div className="activity-content">
              <span className="activity-label">Stock Decreased</span>
              <span className="activity-value">
                -{stats.recentActivity.stockDecrease.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="stats-section">
        <div className="top-products-container">
          <div className="top-products-column">
            <h3 className="column-title">Top Products by Stock</h3>
            <div className="product-list">
              {stats.topProducts.byStock.map((product, index) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  index={index}
                  type="stock"
                />
              ))}
            </div>
          </div>
          <div className="top-products-column">
            <h3 className="column-title">Most Active Products</h3>
            <div className="product-list">
              {stats.topProducts.mostActive.map((product, index) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  index={index}
                  type="activity"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="stats-section" id="alerts-section">
        <h2 className="section-title">Alerts & Warnings</h2>
        <div className="alerts-container">
          {stats.alerts.lowStock.length > 0 && (
            <div className="alert-group">
              <h3 className="alert-group-title">
                ⚠️ Low Stock Items ({stats.alerts.lowStock.length})
              </h3>
              <div className="alert-list">
                {stats.alerts.lowStock.map((product) => (
                  <AlertItem key={product.id} product={product} type="low" />
                ))}
              </div>
            </div>
          )}
          {stats.alerts.outOfStock.length > 0 && (
            <div className="alert-group">
              <h3 className="alert-group-title">
                🚨 Out of Stock Items ({stats.alerts.outOfStock.length})
              </h3>
              <div className="alert-list">
                {stats.alerts.outOfStock.map((product) => (
                  <AlertItem
                    key={product.id}
                    product={product}
                    type="out"
                  />
                ))}
              </div>
            </div>
          )}
          {stats.alerts.lowStock.length === 0 &&
            stats.alerts.outOfStock.length === 0 && (
              <div className="no-alerts">
                <p>✅ No alerts! All products are well-stocked.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;

