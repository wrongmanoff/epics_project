import { useTranslation } from 'react-i18next';
import { OCCUPATIONS, OCCUPATION_QUESTIONS } from './data/occupationQuestions';

function QuestionField({ occupation, question, value, onAnswer, t }) {
  const { key, type, options, maxLength } = question;
  const tKey = `reg.occQuestions.${occupation}.${key}`;

  if (type === 'text') {
    return (
      <div className="reg-group">
        <label className="reg-group__label">{t(tKey)}</label>
        <input
          type="text"
          maxLength={maxLength || 160}
          value={value || ''}
          onChange={(e) => onAnswer(key, e.target.value || null)}
        />
      </div>
    );
  }

  if (type === 'single') {
    return (
      <div className="reg-group">
        <label className="reg-group__label">{t(tKey)}</label>
        <div className="reg-options">
          {options.map((opt) => (
            <label key={opt} className={`reg-option ${value === opt ? 'reg-option--selected' : ''}`}>
              <input
                type="radio"
                name={`${occupation}_${key}`}
                checked={value === opt}
                onChange={() => onAnswer(key, opt)}
              />
              <span>{t(`reg.options.${opt}`)}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'multi') {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (opt) => {
      const next = selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt];
      onAnswer(key, next.length ? next : null);
    };
    return (
      <div className="reg-group">
        <label className="reg-group__label">{t(tKey)}</label>
        <p className="reg-group__hint">{t('reg.selectMultiple')}</p>
        <div className="reg-options">
          {options.map((opt) => (
            <label key={opt} className={`reg-option ${selected.includes(opt) ? 'reg-option--selected' : ''}`}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
              <span>{t(`reg.options.${opt}`)}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function OccupationStep({ data, onChange }) {
  const { t } = useTranslation();
  const selectedOccs = data.occupations || [];
  const answers = data.occupation_answers || {};

  const toggleOccupation = (occ) => {
    const next = selectedOccs.includes(occ) ? selectedOccs.filter((o) => o !== occ) : [...selectedOccs, occ];
    onChange({ ...data, occupations: next });
  };

  const setAnswer = (occ, key, value) => {
    const occAnswers = { ...(answers[occ] || {}), [key]: value };
    if (value === null || value === undefined) delete occAnswers[key];
    onChange({
      ...data,
      occupation_answers: { ...answers, [occ]: occAnswers },
    });
  };

  return (
    <>
      <h2>{t('reg.steps.occupation')}</h2>
      <p className="reg-card__subtitle">{t('reg.occupationSubtitle')}</p>

      <div className="reg-group">
        <label className="reg-group__label">{t('reg.selectOccupations')}</label>
        <p className="reg-group__hint">{t('reg.selectMultiple')}</p>
        <div className="reg-chips">
          {OCCUPATIONS.map((occ) => (
            <button
              key={occ}
              type="button"
              className={`reg-chip ${selectedOccs.includes(occ) ? 'reg-chip--selected' : ''}`}
              onClick={() => toggleOccupation(occ)}
              aria-pressed={selectedOccs.includes(occ)}
            >
              {t(`reg.occupations.${occ}`)}
            </button>
          ))}
        </div>
      </div>

      {selectedOccs.map((occ) => {
        const questions = OCCUPATION_QUESTIONS[occ];
        if (!questions) return null;
        const occAnswers = answers[occ] || {};
        return (
          <div key={occ} className="reg-occ-section">
            <h3>{t(`reg.occupations.${occ}`)}</h3>
            {questions.map((q) => (
              <QuestionField
                key={q.key}
                occupation={occ}
                question={q}
                value={occAnswers[q.key] ?? null}
                onAnswer={(k, v) => setAnswer(occ, k, v)}
                t={t}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}
