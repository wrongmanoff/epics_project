import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StepProgress from './StepProgress';
import BasicInfoStep from './BasicInfoStep';
import OccupationStep from './OccupationStep';
import FamilyStep from './FamilyStep';
import DocumentsStep from './DocumentsStep';
import SchemesStep from './SchemesStep';
import ReviewStep from './ReviewStep';
import * as regService from '../../services/registrationService';
import '../../styles/registration.css';

const TOTAL_STEPS = 6;

function emptyProfile() {
  return {
    status: 'draft',
    current_step: 1,
    basic: {},
    occupations: [],
    occupation_answers: {},
    circumstances: {},
    documents: {},
    scheme_preferences: [],
  };
}

export default function RegistrationWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyProfile);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isNew, setIsNew] = useState(true);

  // Load existing profile
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await regService.getRegistrationProfile();
        if (active && res?.profile) {
          setFormData(res.profile);
          setStep(res.profile.current_step || 1);
          setIsNew(false);
          if (res.profile.status === 'submitted') {
            setSuccess(true);
          }
        }
      } catch {
        // No profile yet — stay with empty
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const save = useCallback(
    async (data, forSubmit = false) => {
      setSaving(true);
      setError(null);
      try {
        const activeAnswers = {};
        for (const occ of data.occupations || []) {
          if (data.occupation_answers?.[occ]) {
            activeAnswers[occ] = data.occupation_answers[occ];
          }
        }
        const payload = {
          ...data,
          occupation_answers: activeAnswers,
          current_step: step,
          status: forSubmit ? 'submitted' : 'draft',
        };
        const fn = isNew ? regService.createRegistrationProfile : regService.updateRegistrationProfile;
        const res = await fn(payload);
        if (res?.profile) {
          setFormData((prev) => ({
            ...res.profile,
            occupation_answers: forSubmit
              ? res.profile.occupation_answers
              : { ...prev.occupation_answers, ...res.profile.occupation_answers },
          }));
          setIsNew(false);
        }
        return true;
      } catch (err) {
        const details = err?.payload?.details;
        if (Array.isArray(details) && details.length > 0) {
          setError(details);
        } else {
          setError(err?.message || t('errors.generic'));
        }
        return false;
      } finally {
        setSaving(false);
      }
    },
    [isNew, step, t],
  );

  const goToStep = (s) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      await save(formData);
      goToStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) goToStep(step - 1);
  };

  const handleSubmit = async () => {
    const ok = await save(formData, true);
    if (ok) setSuccess(true);
  };

  if (loading) {
    return (
      <div className="reg-layout">
        <div className="page-loading" role="status">{t('common.loading')}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reg-layout">
        <div className="reg-card reg-success">
          <div className="reg-success__icon">✅</div>
          <h2>{t('reg.successTitle')}</h2>
          <p>{t('reg.successMessage')}</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setSuccess(false)}>
              {t('reg.editProfile')}
            </button>
            <button type="button" className="btn btn--primary" style={{ maxWidth: '16rem' }} onClick={() => navigate('/dashboard')}>
              {t('reg.goToDashboard')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <BasicInfoStep data={formData} onChange={setFormData} />;
      case 2: return <OccupationStep data={formData} onChange={setFormData} />;
      case 3: return <FamilyStep data={formData} onChange={setFormData} />;
      case 4: return <DocumentsStep data={formData} onChange={setFormData} />;
      case 5: return <SchemesStep data={formData} onChange={setFormData} />;
      case 6: return <ReviewStep data={formData} goToStep={goToStep} />;
      default: return null;
    }
  };

  return (
    <div className="reg-layout">
      <StepProgress currentStep={step} />

      <div className="reg-card">
        {error && (
          <div className="alert alert--error" role="alert">
            {Array.isArray(error) ? (
              <div>
                <strong>{t('reg.validationErrorTitle')}</strong>
                <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.25rem' }}>
                  {error.map((item, idx) => (
                    <li key={`${item.field}-${idx}`}>
                      {t(`reg.validationFields.${item.field}`, { defaultValue: item.field })} — {t(`reg.validationCodes.${item.code}`, { defaultValue: item.code })}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              typeof error === 'string' ? error : t('errors.generic')
            )}
          </div>
        )}

        {renderStep()}

        <div className="reg-nav">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={handlePrev}
            disabled={step === 1 || saving}
          >
            {t('reg.previous')}
          </button>

          {step < TOTAL_STEPS ? (
            <button type="button" className="btn btn--primary" onClick={handleNext} disabled={saving}>
              {saving ? t('reg.saving') : t('reg.next')}
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={handleSubmit} disabled={saving}>
              {saving ? t('reg.submitting') : t('reg.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
