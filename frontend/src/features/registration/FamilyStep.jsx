import { useTranslation } from 'react-i18next';

const DISABILITY_CATEGORIES = [
  'dis_locomotor', 'dis_visual', 'dis_hearing', 'dis_intellectual',
  'dis_multiple', 'dis_other', 'dis_prefer_not',
];
const DISABILITY_RANGES = ['dis_under_40', 'dis_40_80', 'dis_above_80', 'dis_not_sure'];

function Toggle({ label, checked, onChange }) {
  return (
    <label className="reg-toggle">
      <span className="reg-toggle__label">{label}</span>
      <input type="checkbox" checked={checked || false} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export default function FamilyStep({ data, onChange }) {
  const { t } = useTranslation();
  const circ = data.circumstances || {};

  const set = (field, value) => {
    const updated = { ...circ, [field]: value };
    if (field === 'disability_present' && !value) {
      updated.disability_category = null;
      updated.disability_percentage = null;
    }
    if (field === 'senior_citizens' && !value) {
      updated.senior_citizen_count = null;
    }
    onChange({ ...data, circumstances: updated });
  };

  return (
    <>
      <h2>{t('reg.steps.family')}</h2>
      <p className="reg-card__subtitle">{t('reg.familySubtitle')}</p>

      <Toggle label={t('reg.circumstances.disability_present')} checked={circ.disability_present} onChange={(v) => set('disability_present', v)} />

      {circ.disability_present && (
        <div className="reg-occ-section">
          <div className="reg-group">
            <label className="reg-group__label">{t('reg.circumstances.disability_category')}</label>
            <select value={circ.disability_category || ''} onChange={(e) => set('disability_category', e.target.value || null)}>
              <option value="">{t('reg.selectPlaceholder')}</option>
              {DISABILITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{t(`reg.options.${cat}`)}</option>
              ))}
            </select>
          </div>
          <div className="reg-group">
            <label className="reg-group__label">{t('reg.circumstances.disability_percentage')}</label>
            <select value={circ.disability_percentage || ''} onChange={(e) => set('disability_percentage', e.target.value || null)}>
              <option value="">{t('reg.selectPlaceholder')}</option>
              {DISABILITY_RANGES.map((r) => (
                <option key={r} value={r}>{t(`reg.options.${r}`)}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <Toggle label={t('reg.circumstances.senior_citizens')} checked={circ.senior_citizens} onChange={(v) => set('senior_citizens', v)} />

      {circ.senior_citizens && (
        <div className="reg-group" style={{ paddingLeft: '1rem' }}>
          <label className="reg-group__label">{t('reg.circumstances.senior_citizen_count')}</label>
          <input
            type="number"
            min={1}
            max={10}
            value={circ.senior_citizen_count ?? ''}
            onChange={(e) => set('senior_citizen_count', e.target.value ? parseInt(e.target.value, 10) : null)}
          />
        </div>
      )}

      <Toggle label={t('reg.circumstances.widow_headed')} checked={circ.widow_headed} onChange={(v) => set('widow_headed', v)} />
      <Toggle label={t('reg.circumstances.single_parent')} checked={circ.single_parent} onChange={(v) => set('single_parent', v)} />
      <Toggle label={t('reg.circumstances.women_headed')} checked={circ.women_headed} onChange={(v) => set('women_headed', v)} />
      <Toggle label={t('reg.circumstances.shg_member')} checked={circ.shg_member} onChange={(v) => set('shg_member', v)} />
      <Toggle label={t('reg.circumstances.minority_welfare_interest')} checked={circ.minority_welfare_interest} onChange={(v) => set('minority_welfare_interest', v)} />

      <div className="reg-group" style={{ marginTop: '1rem' }}>
        <label className="reg-group__label">{t('reg.circumstances.other_note')}</label>
        <input
          type="text"
          maxLength={300}
          value={circ.other_note || ''}
          onChange={(e) => set('other_note', e.target.value || null)}
          placeholder={t('reg.circumstances.other_note_placeholder')}
        />
      </div>
    </>
  );
}
