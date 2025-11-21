import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import '../../styles/layout.css';

function AppLayout({ children }) {
  const location = useLocation();
  const hideActions = location.pathname === '/login';

  return (
    <div className="app-shell">
      <HeaderBar hideActions={hideActions} />
      <main className="app-content">{children}</main>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;

