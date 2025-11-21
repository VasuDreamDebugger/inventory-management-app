import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import '../../styles/layout.css';

function HeaderBar() {
  const navigate = useNavigate();
  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
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
      <div className="header-actions">
        {user && <span className="user-label">{user.email}</span>}
        {user && (
          <button type="button" className="link-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default HeaderBar;

