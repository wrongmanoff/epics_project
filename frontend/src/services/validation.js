const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

export function validateEmail(email, t) {
  if (!email?.trim()) return t('validation.emailRequired');
  if (!EMAIL_RE.test(email.trim())) return t('validation.emailInvalid');
  return '';
}

export function validatePassword(password, t, { forSignup = false } = {}) {
  if (!password) return t('validation.passwordRequired');
  if (forSignup) {
    if (password.length < 8) return t('validation.passwordShort');
    if (!/[A-Za-z]/.test(password)) return t('validation.passwordLetter');
    if (!/\d/.test(password)) return t('validation.passwordNumber');
  }
  return '';
}

export function validateFullName(name, t) {
  if (!name?.trim()) return t('validation.fullNameRequired');
  if (name.trim().length < 2) return t('validation.fullNameShort');
  return '';
}

export function validateMobile(mobile, t) {
  if (!mobile?.trim()) return '';
  let cleaned = mobile.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+91')) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.slice(2);
  if (!MOBILE_RE.test(cleaned)) return t('validation.mobileInvalid');
  return '';
}

export function mapApiError(error, t) {
  if (!error) return t('errors.generic');
  if (error.message === 'network' || error.status === 0) {
    return t('errors.network');
  }
  if (typeof error.message === 'string' && error.message !== 'request_failed') {
    return error.message;
  }
  return t('errors.generic');
}
