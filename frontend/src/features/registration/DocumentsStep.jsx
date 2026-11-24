import { useTranslation } from 'react-i18next';
import { visibleDocumentCategories, AVAILABILITY } from './data/documents';

export default function DocumentsStep({ data, onChange }) {
  const { t } = useTranslation();
  const docs = data.documents || {};
  const categories = visibleDocumentCategories(data.occupations, data.circumstances);

  const setDoc = (code, value) => {
    const updated = { ...docs };
    if (value === docs[code]) {
      delete updated[code];
    } else {
      updated[code] = value;
    }
    onChange({ ...data, documents: updated });
  };

  return (
    <>
      <h2>{t('reg.steps.documents')}</h2>
      <p className="reg-card__subtitle">{t('reg.documentsSubtitle')}</p>

      {categories.map((cat) => (
        <div key={cat.id} className="reg-doc-category">
          <h4>{t(`reg.docCategories.${cat.id}`)}</h4>
          {cat.documents.map((code) => (
            <div key={code} className="reg-tristate">
              <span className="reg-tristate__label">{t(`reg.documents.${code}`)}</span>
              <div className="reg-tristate__buttons">
                {AVAILABILITY.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`reg-tristate__btn ${docs[code] === av ? `reg-tristate__btn--${av}` : ''}`}
                    onClick={() => setDoc(code, av)}
                    aria-pressed={docs[code] === av}
                  >
                    {t(`reg.availability.${av}`)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
