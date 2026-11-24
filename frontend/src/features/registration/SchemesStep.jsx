import { useTranslation } from 'react-i18next';
import { SCHEME_CATEGORIES } from './data/documents';

export default function SchemesStep({ data, onChange }) {
  const { t } = useTranslation();
  const prefs = data.scheme_preferences || [];

  const toggle = (cat) => {
    const next = prefs.includes(cat) ? prefs.filter((c) => c !== cat) : [...prefs, cat];
    onChange({ ...data, scheme_preferences: next });
  };

  return (
    <>
      <h2>{t('reg.steps.schemes')}</h2>
      <p className="reg-card__subtitle">{t('reg.schemesSubtitle')}</p>

      <div className="reg-group">
        <label className="reg-group__label">{t('reg.schemeInterests')}</label>
        <p className="reg-group__hint">{t('reg.selectMultiple')}</p>
        <div className="reg-chips">
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`reg-chip ${prefs.includes(cat) ? 'reg-chip--selected' : ''}`}
              onClick={() => toggle(cat)}
              aria-pressed={prefs.includes(cat)}
            >
              {t(`reg.schemes.${cat}`)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
