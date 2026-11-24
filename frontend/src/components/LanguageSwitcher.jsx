import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ id = 'language-select' }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="language-switcher">
      <label htmlFor={id}>{t('language.label')}</label>
      <select
        id={id}
        value={i18n.language?.startsWith('hi') ? 'hi' : i18n.language?.startsWith('mr') ? 'mr' : 'en'}
        onChange={(event) => {
          i18n.changeLanguage(event.target.value);
        }}
        aria-label={t('language.label')}
      >
        <option value="en">{t('language.en')}</option>
        <option value="hi">{t('language.hi')}</option>
        <option value="mr">{t('language.mr')}</option>
      </select>
    </div>
  );
}
