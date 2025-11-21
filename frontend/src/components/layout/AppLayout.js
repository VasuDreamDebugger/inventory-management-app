import { Outlet } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import '../../styles/layout.css';

function AppLayout() {
  return (
    <div className="app-shell">
      <HeaderBar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

