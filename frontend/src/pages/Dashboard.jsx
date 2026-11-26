import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FEATURE_CARDS } from '../features/dashboard/config/navigation';
import WelcomeSection from '../features/dashboard/components/WelcomeSection';
import QuickAccess from '../features/dashboard/components/QuickAccess';
import FeatureCard from '../features/dashboard/components/FeatureCard';
import AccountOverview from '../features/dashboard/components/AccountOverview';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard__card">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.welcome', { name: displayName })}</p>
        <p>{t('dashboard.intro')}</p>

        <h2 style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
          {t('dashboard.profileHeading')}
        </h2>
        <ul className="profile-list">
          <li>
            <span>{t('dashboard.email')}</span>
            <span>{user?.email || '—'}</span>
          </li>
          <li>
            <span>{t('dashboard.mobile')}</span>
            <span>{user?.mobile_number || t('dashboard.mobileEmpty')}</span>
          </li>
        </ul>

        <div className="dashboard__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? t('dashboard.loggingOut') : t('dashboard.logout')}
          </button>
        </div>

        <div className="dash-cards-grid">
          {FEATURE_CARDS.map((item) => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <AccountOverview user={user} />
    </div>
  );
}
