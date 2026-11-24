import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { mapApiError, validateEmail, validatePassword } from '../services/validation';

export default function Login() {
  const { t } = useTranslation();
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const next = {
      email: validateEmail(email, t),
      password: validatePassword(password, t),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
        remember_me: rememberMe,
      });
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(mapApiError(error, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-card">
          <h1>{t('login.title')}</h1>
          <p className="auth-card__subtitle">{t('login.subtitle')}</p>

          {formError ? (
            <div className="alert alert--error" role="alert">
              {formError}
            </div>
          ) : null}

          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            <InputField
              label={t('login.emailLabel')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.emailPlaceholder')}
              autoComplete="email"
              required
              error={errors.email}
            />

            <InputField
              label={t('login.passwordLabel')}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
              required
              showPasswordToggle
              error={errors.password}
            />

            <div className="form-row-between">
              <div className="checkbox-row">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">{t('login.rememberMe')}</label>
              </div>
              <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
            </div>

            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <p className="auth-footer-links">
            {t('login.noAccount')}{' '}
            <Link to="/signup">{t('login.createAccount')}</Link>
          </p>
        </div>
      </div>

      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-aside__inner">
          <h2>{t('brand.name')}</h2>
          <p>{t('brand.tagline')}</p>
        </div>
      </aside>
    </div>
  );
}
