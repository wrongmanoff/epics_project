import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { DASHBOARD_NAV_ITEMS } from '../config/navigation';
import { DashboardIcon } from '../components/DashboardIcons';

export default function PlaceholderPage({ moduleId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');

  const moduleConfig =
    DASHBOARD_NAV_ITEMS.find((item) => item.id === moduleId) ||
    DASHBOARD_NAV_ITEMS[1];

  return (
    <div className="dash-container">
      <div className="dash-placeholder">
        <div className="dash-placeholder__icon">
          <DashboardIcon name={moduleConfig.icon} size={30} />
        </div>

        <span className="dash-badge dash-badge--saffron">
          {t('placeholder.underDevelopment')}
        </span>

        <h1 className="dash-placeholder__title">{t(moduleConfig.labelKey)}</h1>
        <p className="dash-placeholder__desc">
          {t(moduleConfig.placeholderDescKey || moduleConfig.descriptionKey)}
        </p>

        {searchQuery && (
          <p className="dash-placeholder__query">
            {t('placeholder.searchContext', { query: searchQuery })}
          </p>
        )}

        {moduleId === 'profile' && user && (
          <div className="dash-placeholder__profile">
            <h2>{t('dashboard.profileHeading')}</h2>
            <dl className="dash-account-grid">
              <div className="dash-account-item">
                <dt>{t('dashboard.fullName')}</dt>
                <dd>{user.full_name || '—'}</dd>
              </div>
              <div className="dash-account-item">
                <dt>{t('dashboard.email')}</dt>
                <dd>{user.email || '—'}</dd>
              </div>
              <div className="dash-account-item">
                <dt>{t('dashboard.mobile')}</dt>
                <dd>{user.mobile_number || t('dashboard.mobileEmpty')}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="dash-placeholder__actions">
          <Link to="/dashboard" className="btn btn--primary dash-placeholder__btn">
            <DashboardIcon name="chevronLeft" size={18} />
            <span>{t('placeholder.backToDashboard')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
