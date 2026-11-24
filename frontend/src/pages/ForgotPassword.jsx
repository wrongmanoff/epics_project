import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import { forgotPassword } from '../services/authService';
import { mapApiError, validateEmail } from '../services/validation';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccess('');
    const emailError = validateEmail(email, t);
    setError(emailError);
    if (emailError) return;

    setSubmitting(true);
    try {
      const data = await forgotPassword(email.trim().toLowerCase());
      setSuccess(data.message || t('forgot.success'));
    } catch (err) {
      setFormError(mapApiError(err, t));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-card">
          <h1>{t('forgot.title')}</h1>
          <p className="auth-card__subtitle">{t('forgot.subtitle')}</p>

          {formError ? (
            <div className="alert alert--error" role="alert">
              {formError}
            </div>
          ) : null}
          {success ? (
            <div className="alert alert--success" role="status">
              {success}
            </div>
          ) : null}

          <form className="form-stack" onSubmit={handleSubmit} noValidate>
            <InputField
              label={t('forgot.emailLabel')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('forgot.emailPlaceholder')}
              autoComplete="email"
              required
              error={error}
            />

            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? t('forgot.submitting') : t('forgot.submit')}
            </button>
          </form>

          <p className="auth-footer-links">
            <Link to="/login">{t('common.backToLogin')}</Link>
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
