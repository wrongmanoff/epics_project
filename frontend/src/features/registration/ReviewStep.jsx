import { useTranslation } from 'react-i18next';
import { OCCUPATION_QUESTIONS } from './data/occupationQuestions';
import { visibleDocumentCategories } from './data/documents';

function ReviewRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <dl className="reg-review-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
  );
}

function Section({ title, onEdit, editLabel, children }) {
  return (
    <div className="reg-review-section">
      <h3>
        {title}
        {onEdit && (
          <button type="button" onClick={onEdit}>
            {editLabel}
          </button>
        )}
      </h3>
      {children}
    </div>
  );
}

export default function ReviewStep({ data, goToStep }) {
  const { t } = useTranslation();
  const basic = data.basic || {};
  const occupations = data.occupations || [];
  const answers = data.occupation_answers || {};
  const circ = data.circumstances || {};
  const docs = data.documents || {};
  const prefs = data.scheme_preferences || [];

  const tVal = (prefix, val) => (val ? t(`reg.${prefix}.${val}`) : '—');
  const editLabel = t('reg.edit');

  return (
    <>
      <h2>{t('reg.steps.review')}</h2>
      <p className="reg-card__subtitle">{t('reg.reviewSubtitle')}</p>

      <Section title={t('reg.steps.basic')} onEdit={() => goToStep(1)} editLabel={editLabel}>
        <ReviewRow label={t('reg.ageGroup')} value={tVal('ageGroups', basic.age_group)} />
        <ReviewRow label={t('reg.gender')} value={tVal('genders', basic.gender)} />
        <ReviewRow label={t('reg.state')} value={basic.state ? tVal('states', basic.state) : null} />
        <ReviewRow label={t('reg.district')} value={basic.district === 'other' ? basic.district_other : tVal('districts', basic.district)} />
        <ReviewRow label={t('reg.village')} value={basic.village} />
        <ReviewRow label={t('reg.residenceType')} value={tVal('residenceTypes', basic.residence_type)} />
        <ReviewRow label={t('reg.familySize')} value={basic.family_size} />
        <ReviewRow label={t('reg.incomeRange')} value={tVal('incomeRanges', basic.household_income_range)} />
        <ReviewRow label={t('reg.maritalStatus')} value={tVal('maritalStatuses', basic.marital_status)} />
      </Section>

      <Section title={t('reg.steps.occupation')} onEdit={() => goToStep(2)} editLabel={editLabel}>
        {occupations.length > 0 ? (
          occupations.map((occ) => (
            <div key={occ} style={{ marginBottom: '0.75rem' }}>
              <strong style={{ color: 'var(--color-saffron)' }}>{t(`reg.occupations.${occ}`)}</strong>
              {OCCUPATION_QUESTIONS[occ]?.map((q) => {
                const val = answers[occ]?.[q.key];
                if (val === null || val === undefined) return null;
                const display = Array.isArray(val)
                  ? val.map((v) => t(`reg.options.${v}`)).join(', ')
                  : typeof val === 'string' && !q.type?.includes('text')
                    ? t(`reg.options.${val}`)
                    : val;
                return <ReviewRow key={q.key} label={t(`reg.occQuestions.${occ}.${q.key}`)} value={display} />;
              })}
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('reg.noOccupations')}</p>
        )}
      </Section>

      <Section title={t('reg.steps.family')} onEdit={() => goToStep(3)} editLabel={editLabel}>
        {circ.disability_present && <ReviewRow label={t('reg.circumstances.disability_category')} value={tVal('options', circ.disability_category)} />}
        {circ.disability_present && <ReviewRow label={t('reg.circumstances.disability_percentage')} value={tVal('options', circ.disability_percentage)} />}
        {circ.senior_citizens && <ReviewRow label={t('reg.circumstances.senior_citizen_count')} value={circ.senior_citizen_count} />}
        <ReviewRow label={t('reg.circumstances.widow_headed')} value={circ.widow_headed ? t('reg.yes') : null} />
        <ReviewRow label={t('reg.circumstances.single_parent')} value={circ.single_parent ? t('reg.yes') : null} />
        <ReviewRow label={t('reg.circumstances.women_headed')} value={circ.women_headed ? t('reg.yes') : null} />
        <ReviewRow label={t('reg.circumstances.shg_member')} value={circ.shg_member ? t('reg.yes') : null} />
        <ReviewRow label={t('reg.circumstances.minority_welfare_interest')} value={circ.minority_welfare_interest ? t('reg.yes') : null} />
        {circ.other_note && <ReviewRow label={t('reg.circumstances.other_note')} value={circ.other_note} />}
      </Section>

      <Section title={t('reg.steps.documents')} onEdit={() => goToStep(4)} editLabel={editLabel}>
        {visibleDocumentCategories(occupations, circ).map((cat) => (
          <div key={cat.id}>
            {cat.documents.map((code) =>
              docs[code] ? <ReviewRow key={code} label={t(`reg.documents.${code}`)} value={t(`reg.availability.${docs[code]}`)} /> : null,
            )}
          </div>
        ))}
      </Section>

      <Section title={t('reg.steps.schemes')} onEdit={() => goToStep(5)} editLabel={editLabel}>
        {prefs.length > 0 ? (
          <div className="reg-chips">
            {prefs.map((cat) => (
              <span key={cat} className="reg-chip reg-chip--selected">
                {t(`reg.schemes.${cat}`)}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-secondary)' }}>{t('reg.noSchemes')}</p>
        )}
      </Section>
    </>
  );
}
