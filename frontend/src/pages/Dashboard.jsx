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
    <div className="dash-container">
      <WelcomeSection user={user} />

      <QuickAccess />

      <section className="dash-section" aria-labelledby="dash-services-heading">
        <div className="dash-section__header">
          <h2 id="dash-services-heading" className="dash-section__title">
            {t('dashboard.servicesHeading')}
          </h2>
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
