import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardIcon } from './DashboardIcons';

export default function WelcomeSection({ user }) {
  const { t } = useTranslation();

  const rawName = (user?.full_name || '').trim();
  const firstName = rawName ? rawName.split(/\s+/)[0] : user?.email || '';

  const fields = [
    Boolean(user?.full_name?.trim()),
    Boolean(user?.email?.trim()),
    Boolean(user?.mobile_number?.trim()),
  ];
  const completedCount = fields.filter(Boolean).length;
  const totalCount = fields.length;
  const allBasicFieldsPresent = completedCount === totalCount;

  return (
    <section className="dash-welcome" aria-labelledby="dash-welcome-heading">
      <div className="dash-welcome__content">
        <span className="dash-welcome__eyebrow">{t('dashboard.welcome.badge')}</span>
        <h1 id="dash-welcome-heading" className="dash-welcome__title">
          {t('dashboard.welcome.title', { name: firstName })}
        </h1>
        <p className="dash-welcome__subtitle">{t('dashboard.welcome.subtitle')}</p>
      </div>

      <div className="dash-welcome__status">
        <div className="dash-status-card">
          <div className="dash-status-card__top">
            <span className="dash-status-card__label">
              {t('dashboard.welcome.accountStatusLabel')}
            </span>
            <span
              className={`dash-badge ${
                allBasicFieldsPresent ? 'dash-badge--success' : 'dash-badge--saffron'
              }`}
            >
              <DashboardIcon name="checkCircle" size={14} />
              <span>
                {t('dashboard.welcome.fieldsCompleted', {
                  completed: completedCount,
                  total: totalCount,
                })}
              </span>
            </span>
          </div>

          <p className="dash-status-card__hint">
            {allBasicFieldsPresent
              ? t('dashboard.welcome.profileReady')
              : t('dashboard.welcome.profileIncomplete')}
          </p>

          <Link to="/profile" className="dash-status-card__link">
            <span>{t('dashboard.cards.profile.action')}</span>
            <DashboardIcon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
