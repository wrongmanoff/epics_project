import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AccountOverview({ user }) {
  const { t, i18n } = useTranslation();

  const formattedDate = (() => {
    if (!user?.created_at) return null;
    try {
      const locale =
        i18n.language === 'hi'
          ? 'hi-IN'
          : i18n.language === 'mr'
            ? 'mr-IN'
            : 'en-IN';
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(user.created_at));
    } catch {
      return null;
    }
  })();

  return (
    <section className="dash-section" aria-labelledby="dash-account-heading">
      <div className="dash-section__header">
        <h2 id="dash-account-heading" className="dash-section__title">
          {t('dashboard.profileHeading')}
        </h2>
        <Link to="/profile" className="dash-section__link">
          {t('dashboard.cards.profile.action')}
        </Link>
      </div>

      <div className="dash-account-card">
        <dl className="dash-account-grid">
          <div className="dash-account-item">
            <dt>{t('dashboard.fullName')}</dt>
            <dd>{user?.full_name || '—'}</dd>
          </div>
          <div className="dash-account-item">
            <dt>{t('dashboard.email')}</dt>
            <dd>{user?.email || '—'}</dd>
          </div>
          <div className="dash-account-item">
            <dt>{t('dashboard.mobile')}</dt>
            <dd>{user?.mobile_number || t('dashboard.mobileEmpty')}</dd>
          </div>
          {formattedDate && (
            <div className="dash-account-item">
              <dt>{t('dashboard.memberSince')}</dt>
              <dd>{formattedDate}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
