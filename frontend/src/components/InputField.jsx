import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  required = false,
  hint,
  showPasswordToggle = false,
}) {
  const { t } = useTranslation();
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const [visible, setVisible] = useState(false);

  const inputType =
    showPasswordToggle && type === 'password'
      ? visible
        ? 'text'
        : 'password'
      : type;

  return (
    <div className="field">
      <div className="field__label-row">
        <label htmlFor={inputId}>{label}</label>
        {hint ? <span className="field__hint">{hint}</span> : null}
      </div>
      <div className="field__control">
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={showPasswordToggle ? 'has-toggle' : undefined}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t('common.hidePassword') : t('common.showPassword')}
          >
            {visible ? t('common.hidePassword') : t('common.showPassword')}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
