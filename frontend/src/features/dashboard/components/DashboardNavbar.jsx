import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { DASHBOARD_NAV_ITEMS } from '../config/navigation';
import { DashboardIcon } from './DashboardIcons';

function getInitials(user) {
  const source = (user?.full_name || user?.email || 'U').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function DashboardNavbar({
  user,
  onOpenMobileMenu,
  onLogout,
  loggingOut,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const displayName = user?.full_name || user?.email || '';
  const initials = getInitials(user);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return DASHBOARD_NAV_ITEMS.filter((item) => {
      const label = t(item.labelKey).toLowerCase();
      const desc = item.descriptionKey ? t(item.descriptionKey).toLowerCase() : '';
      return label.includes(normalized) || desc.includes(normalized);
    });
  }, [query, t]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setQuery('');
      setSearchOpen(false);
    } else if (query.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="dash-navbar">
      <div className="dash-navbar__left">
        <button
          type="button"
          className="dash-icon-btn dash-navbar__menu-btn"
          onClick={onOpenMobileMenu}
          aria-label={t('dashboard.navbar.openMenu')}
        >
          <DashboardIcon name="menu" size={22} />
        </button>

        <form
          ref={searchRef}
          className="dash-search"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <span className="dash-search__icon">
            <DashboardIcon name="search" size={17} />
          </span>
          <input
            type="search"
            className="dash-search__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setSearchOpen(true);
            }}
            placeholder={t('dashboard.navbar.searchPlaceholder')}
            aria-label={t('dashboard.navbar.searchLabel')}
          />

          {searchOpen && query.trim() && (
            <div className="dash-popover dash-search__results" role="listbox">
              {searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    className="dash-search__item"
                    onClick={() => {
                      navigate(item.path);
                      setQuery('');
                      setSearchOpen(false);
                    }}
                  >
                    <DashboardIcon name={item.icon} size={18} />
                    <span>{t(item.labelKey)}</span>
                  </button>
                ))
              ) : (
                <button
                  type="submit"
                  className="dash-search__item dash-search__item--fallback"
                >
                  <DashboardIcon name="schemes" size={18} />
                  <span>
                    {t('dashboard.navbar.searchSchemesFor', { query: query.trim() })}
                  </span>
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="dash-navbar__right">
        <LanguageSwitcher id="dashboard-language-select" />

        <div ref={notifRef} className="dash-dropdown-wrap">
          <button
            type="button"
            className="dash-icon-btn"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label={t('dashboard.navbar.notifications')}
            aria-expanded={notifOpen}
            aria-haspopup="true"
          >
            <DashboardIcon name="bell" size={20} />
          </button>

          {notifOpen && (
            <div
              className="dash-popover dash-popover--right dash-notif-popover"
              role="region"
              aria-label={t('dashboard.navbar.notifications')}
            >
              <div className="dash-popover__header">
                {t('dashboard.navbar.notifications')}
              </div>
              <p className="dash-notif-popover__empty">
                {t('dashboard.navbar.noNotifications')}
              </p>
            </div>
          )}
        </div>

        <div ref={profileRef} className="dash-dropdown-wrap">
          <button
            type="button"
            className="dash-user-trigger"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="dash-avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="dash-user-trigger__name">{displayName}</span>
            <DashboardIcon name="chevronDown" size={16} />
          </button>

          {profileOpen && (
            <div
              className="dash-popover dash-popover--right dash-user-menu"
              role="menu"
            >
              <div className="dash-user-menu__summary">
                <div className="dash-user-menu__name">{displayName}</div>
                {user?.email && (
                  <div className="dash-user-menu__email">{user.email}</div>
                )}
              </div>
              <Link
                to="/profile"
                className="dash-user-menu__item"
                role="menuitem"
                onClick={() => setProfileOpen(false)}
              >
                <DashboardIcon name="profile" size={17} />
                <span>{t('dashboard.nav.profile')}</span>
              </Link>
              <button
                type="button"
                className="dash-user-menu__item dash-user-menu__item--danger"
                role="menuitem"
                disabled={loggingOut}
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
              >
                <DashboardIcon name="logout" size={17} />
                <span>
                  {loggingOut ? t('dashboard.loggingOut') : t('dashboard.logout')}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
