import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar__brand">
        <span className="navbar__name">{t('brand.name')}</span>
        <span className="navbar__tagline">{t('brand.tagline')}</span>
      </Link>
      <div className="navbar__actions">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
