import { useTranslation } from 'react-i18next';
import { STATES, DISTRICTS, BLOCKS, OTHER } from './data/locations';

const AGE_GROUPS = ['age_18_25', 'age_26_35', 'age_36_45', 'age_46_59', 'age_60_plus'];
const GENDERS = ['female', 'male', 'other', 'prefer_not'];
const RESIDENCE_TYPES = ['rural', 'urban'];
const INCOME_RANGES = ['income_below_1', 'income_1_2_5', 'income_2_5_5', 'income_5_8', 'income_above_8', 'income_prefer_not'];
const MARITAL_STATUSES = ['marital_single', 'marital_married', 'marital_widowed', 'marital_divorced', 'marital_separated', 'marital_prefer_not'];

function Select({ label, value, onChange, options, tPrefix, placeholder, t }) {
  return (
    <div className="reg-group">
      <label className="reg-group__label">{label}</label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">{placeholder || t('reg.selectPlaceholder')}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {t(`reg.${tPrefix}.${opt}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function BasicInfoStep({ data, onChange }) {
  const { t } = useTranslation();
  const basic = data.basic || {};

  const set = (field, value) => {
    const updated = { ...basic, [field]: value };

    // Reset dependent fields
    if (field === 'state') {
      updated.district = null;
      updated.district_other = null;
      updated.block = null;
      updated.block_other = null;
    }
    if (field === 'district') {
      updated.block = null;
      updated.block_other = null;
    }

    onChange({ ...data, basic: updated });
  };

  const state = basic.state;
  const districtList = state && DISTRICTS[state] ? [...DISTRICTS[state], OTHER] : [];
  const hasDistrictList = districtList.length > 0;
  const district = basic.district;
  const blockList = district && district !== OTHER && BLOCKS[district] ? [...BLOCKS[district], OTHER] : [];
  const needsDistrictText = !hasDistrictList || district === OTHER;
  const needsBlockText = !blockList.length || basic.block === OTHER;

  return (
    <>
      <h2>{t('reg.steps.basic')}</h2>
      <p className="reg-card__subtitle">{t('reg.basicSubtitle')}</p>

      <Select label={t('reg.ageGroup')} value={basic.age_group} onChange={(v) => set('age_group', v)} options={AGE_GROUPS} tPrefix="ageGroups" t={t} />
      <Select label={t('reg.gender')} value={basic.gender} onChange={(v) => set('gender', v)} options={GENDERS} tPrefix="genders" t={t} />
      <Select label={t('reg.state')} value={state} onChange={(v) => set('state', v)} options={STATES} tPrefix="states" t={t} />

      {hasDistrictList && (
        <Select label={t('reg.district')} value={district} onChange={(v) => set('district', v)} options={districtList} tPrefix="districts" t={t} />
      )}

      {needsDistrictText && state && (
        <div className="reg-group">
          <label className="reg-group__label">{t('reg.districtOther')}</label>
          <input type="text" maxLength={80} value={basic.district_other || ''} onChange={(e) => set('district_other', e.target.value)} />
        </div>
      )}

      {blockList.length > 0 && (
        <Select label={t('reg.block')} value={basic.block} onChange={(v) => set('block', v)} options={blockList} tPrefix="blocks" t={t} />
      )}

      {needsBlockText && state && (
        <div className="reg-group">
          <label className="reg-group__label">{t('reg.blockOther')}</label>
          <input type="text" maxLength={80} value={basic.block_other || ''} onChange={(e) => set('block_other', e.target.value)} />
        </div>
      )}

      <div className="reg-group">
        <label className="reg-group__label">{t('reg.village')}</label>
        <input type="text" maxLength={80} value={basic.village || ''} onChange={(e) => set('village', e.target.value)} />
      </div>

      <Select label={t('reg.residenceType')} value={basic.residence_type} onChange={(v) => set('residence_type', v)} options={RESIDENCE_TYPES} tPrefix="residenceTypes" t={t} />

      <div className="reg-group">
        <label className="reg-group__label">{t('reg.familySize')}</label>
        <input
          type="number"
          min={1}
          max={20}
          value={basic.family_size ?? ''}
          onChange={(e) => set('family_size', e.target.value ? parseInt(e.target.value, 10) : null)}
        />
      </div>

      <Select label={t('reg.incomeRange')} value={basic.household_income_range} onChange={(v) => set('household_income_range', v)} options={INCOME_RANGES} tPrefix="incomeRanges" t={t} />
      <Select label={t('reg.maritalStatus')} value={basic.marital_status} onChange={(v) => set('marital_status', v)} options={MARITAL_STATUSES} tPrefix="maritalStatuses" t={t} />
    </>
  );
}
