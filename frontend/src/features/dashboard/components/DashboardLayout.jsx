import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import '../styles/dashboard.css';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="dash-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <div className="dash-workspace">
        <DashboardNavbar
          user={user}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />

        <main className="dash-main">
          <Outlet />
        </main>

        <footer className="app-footer dash-footer">
          <p>{t('footer.disclaimer')}</p>
        </footer>
      </div>
    </div>
  );
}
