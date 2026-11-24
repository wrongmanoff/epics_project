import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import {
  mapApiError,
  validateEmail,
  validateFullName,
  validateMobile,
  validatePassword,
} from '../services/validation';

export default function Signup() {
  const { t } = useTranslation();
  const { signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const next = {
      fullName: validateFullName(fullName, t),
      email: validateEmail(email, t),
      mobile: validateMobile(mobile, t),
      password: validatePassword(password, t, { forSignup: true }),
      confirmPassword:
        password !== confirmPassword ? t('validation.passwordMismatch') : '',
      acceptTerms: acceptTerms ? '' : t('validation.termsRequired'),
    };
    setErrors(next);
    return Object.values(next).every((value) => !value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await signup({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile_number: mobile.trim() || null,
        password,
        confirm_password: confirmPassword,
        accept_terms: true,
      });

      if (data.email_confirmation_required) {
        setFormSuccess(t('signup.verifyEmail'));
        setPassword('');
        setConfirmPassword('');
      } else {
        setFormSuccess(t('signup.success'));
        navigate('/dashboard', { replace: true });
      }
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
          <h1>{t('signup.title')}</h1>
          <p className="auth-card__subtitle">{t('signup.subtitle')}</p>

          {formError ? (
            <div className="alert alert--error" role="alert">
              {formError}
            </div>
          ) : null}
          {formSuccess ? (
            <div className="alert alert--success" role="status">
              {formSuccess}
            </div>
          ) : null}

          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            <InputField
              label={t('signup.fullNameLabel')}
              name="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('signup.fullNamePlaceholder')}
              autoComplete="name"
              required
              error={errors.fullName}
            />

            <InputField
              label={t('signup.emailLabel')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('signup.emailPlaceholder')}
              autoComplete="email"
              required
              error={errors.email}
            />

            <InputField
              label={t('signup.mobileLabel')}
              name="mobile_number"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('signup.mobilePlaceholder')}
              autoComplete="tel"
              hint={t('signup.mobileHint')}
              error={errors.mobile}
            />

            <InputField
              label={t('signup.passwordLabel')}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('signup.passwordPlaceholder')}
              autoComplete="new-password"
              required
              showPasswordToggle
              error={errors.password}
            />

            <InputField
              label={t('signup.confirmPasswordLabel')}
              name="confirm_password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('signup.confirmPasswordPlaceholder')}
              autoComplete="new-password"
              required
              showPasswordToggle
              error={errors.confirmPassword}
            />

            <div>
              <div className="checkbox-row">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  aria-invalid={Boolean(errors.acceptTerms)}
                />
                <label htmlFor="accept-terms">{t('signup.acceptTerms')}</label>
              </div>
              {errors.acceptTerms ? (
                <p className="field__error" role="alert">
                  {errors.acceptTerms}
                </p>
              ) : null}
            </div>

            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? t('signup.submitting') : t('signup.submit')}
            </button>
          </form>

          <p className="auth-footer-links">
            {t('signup.hasAccount')}{' '}
            <Link to="/login">{t('signup.loginLink')}</Link>
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
