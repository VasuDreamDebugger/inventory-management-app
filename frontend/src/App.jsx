import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoginPage from './components/auth/LoginPage';
import ProductsPage from './components/products/ProductsPage';
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
