import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_NAV_ITEMS } from '../config/navigation';
import { DashboardIcon } from './DashboardIcons';

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onLogout,
  loggingOut,
}) {
  const { t } = useTranslation();

  return (
    <>
      {mobileOpen && (
        <div
          className="dash-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`dash-sidebar ${collapsed ? 'dash-sidebar--collapsed' : ''} ${
          mobileOpen ? 'dash-sidebar--mobile-open' : ''
        }`}
        aria-label={t('dashboard.sidebar.ariaLabel')}
      >
        <div className="dash-sidebar__header">
          <Link
            to="/dashboard"
            className="dash-sidebar__brand"
            onClick={onCloseMobile}
            title={t('brand.name')}
          >
            <span className="dash-sidebar__logo" aria-hidden="true">
              JS
            </span>
            {!collapsed && (
              <span className="dash-sidebar__brand-text">
                <span className="dash-sidebar__brand-name">{t('brand.name')}</span>
                <span className="dash-sidebar__brand-tag">
                  {t('dashboard.sidebar.portalLabel')}
                </span>
              </span>
            )}
          </Link>

          <button
            type="button"
            className="dash-icon-btn dash-sidebar__collapse-btn"
            onClick={onToggleCollapse}
            aria-label={
              collapsed
                ? t('dashboard.sidebar.expand')
                : t('dashboard.sidebar.collapse')
            }
            aria-expanded={!collapsed}
            title={
              collapsed
                ? t('dashboard.sidebar.expand')
                : t('dashboard.sidebar.collapse')
            }
          >
            <DashboardIcon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
          </button>

          <button
            type="button"
            className="dash-icon-btn dash-sidebar__mobile-close"
            onClick={onCloseMobile}
            aria-label={t('dashboard.sidebar.closeMenu')}
          >
            <DashboardIcon name="close" size={20} />
          </button>
        </div>

        <nav className="dash-sidebar__nav">
          <ul className="dash-sidebar__list">
            {DASHBOARD_NAV_ITEMS.map((item) => {
              const label = t(item.labelKey);
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onCloseMobile}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `dash-sidebar__link ${isActive ? 'dash-sidebar__link--active' : ''}`
                    }
                  >
                    <span className="dash-sidebar__link-icon">
                      <DashboardIcon name={item.icon} size={20} />
                    </span>
                    {!collapsed && <span className="dash-sidebar__link-label">{label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="dash-sidebar__footer">
          <button
            type="button"
            className="dash-sidebar__logout"
            onClick={onLogout}
            disabled={loggingOut}
            title={collapsed ? t('dashboard.logout') : undefined}
          >
            <span className="dash-sidebar__link-icon">
              <DashboardIcon name="logout" size={20} />
            </span>
            {!collapsed && (
              <span>
                {loggingOut ? t('dashboard.loggingOut') : t('dashboard.logout')}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
