import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QUICK_ACCESS_ITEMS } from '../config/navigation';
import { DashboardIcon } from './DashboardIcons';

export default function QuickAccess() {
  const { t } = useTranslation();

  return (
    <section className="dash-section" aria-labelledby="dash-quick-access-heading">
      <div className="dash-section__header">
        <h2 id="dash-quick-access-heading" className="dash-section__title">
          {t('dashboard.quickAccess.title')}
        </h2>
      </div>

      <div className="dash-quick-access">
        {QUICK_ACCESS_ITEMS.map((item) => (
          <Link key={item.id} to={item.path} className="dash-quick-pill">
            <span className="dash-quick-pill__icon">
              <DashboardIcon name={item.icon} size={18} />
            </span>
            <span className="dash-quick-pill__label">{t(item.labelKey)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
