import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';

const STORAGE_KEY = 'jansahayak_lang';

const savedLanguage = (() => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value && ['en', 'hi', 'mr'].includes(value)) {
      return value;
    }
  } catch {
    /* ignore */
  }
  return 'en';
})();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLanguage;
}

export { STORAGE_KEY };
export default i18n;
