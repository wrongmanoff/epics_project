import { useTranslation } from 'react-i18next';
import { STEPS } from './data/occupationQuestions';

export default function StepProgress({ currentStep }) {
  const { t } = useTranslation();

  return (
    <div className="reg-progress" role="navigation" aria-label={t('reg.progressLabel')}>
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const cls = isDone ? 'reg-progress__step--done' : isActive ? 'reg-progress__step--active' : '';

        return (
          <div className={`reg-progress__step ${cls}`} key={step} aria-current={isActive ? 'step' : undefined}>
            <div className="reg-progress__circle">{isDone ? '✓' : stepNum}</div>
            <span className="reg-progress__label">{t(`reg.steps.${step}`)}</span>
            {i < STEPS.length - 1 && (
              <div className={`reg-progress__line ${isDone ? 'reg-progress__line--done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
