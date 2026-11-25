import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardIcon } from './DashboardIcons';

export default function FeatureCard({ item }) {
  const { t } = useTranslation();

  return (
    <Link to={item.path} className="dash-feature-card">
      <div className="dash-feature-card__icon">
        <DashboardIcon name={item.icon} size={24} />
      </div>

      <div className="dash-feature-card__body">
        <h3 className="dash-feature-card__title">{t(item.titleKey)}</h3>
        <p className="dash-feature-card__desc">{t(item.descriptionKey)}</p>
      </div>

      <div className="dash-feature-card__footer">
        <span className="dash-feature-card__action">{t(item.actionKey)}</span>
        <span className="dash-feature-card__arrow" aria-hidden="true">
          <DashboardIcon name="arrowRight" size={16} />
        </span>
      </div>
    </Link>
  );
}
