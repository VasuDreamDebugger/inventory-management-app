import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import LoginPage from './components/auth/LoginPage';
import ProductsPage from './components/products/ProductsPage';
import StatsPage from './components/stats/StatsPage';
import AppLayout from './components/layout/AppLayout';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={(
              <RequireAuth>
                <ProductsPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/stats"
            element={(
              <RequireAuth>
                <StatsPage />
              </RequireAuth>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
      <Toaster
         
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1e1e23',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '12px 16px',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: {
              primary: '#1a7f4b',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#c53d2c',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
