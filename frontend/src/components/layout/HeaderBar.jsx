import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../styles/layout.css';

function HeaderBar({ hideActions = false }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener(authApi.AUTH_EVENT, handleAuthChange);
    return () => window.removeEventListener(authApi.AUTH_EVENT, handleAuthChange);
  }, []);

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <header className="header-bar">
      <div className="header-brand">
        <span className="app-title">Inventory Management</span>
      </div>
      {!hideActions && (
        <div className="header-actions">
          {user && <span className="user-label" style={{ fontSize: '25px' }}>{user.name.split('@')[0]}</span>}
          {user && (
            <button type="button" className="link-button" style={{ fontSize: '15px' }} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

HeaderBar.propTypes = {
  hideActions: PropTypes.bool,
};

export default HeaderBar;

