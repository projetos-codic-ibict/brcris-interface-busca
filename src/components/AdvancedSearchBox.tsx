/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { withSearch } from '@elastic/react-search-ui';
import { SearchContextState } from '@elastic/search-ui';
import { useTranslation } from 'next-i18next';
import { FormEvent, useEffect, useState } from 'react';
import { IoAdd, IoClose, IoSearch } from 'react-icons/io5';
import styles from '../styles/AdvancedSearch.module.css';
import { QueryItem } from '../types/Entities';

interface CustomSearchBoxProps extends SearchContextState {
  fieldNames: string[];
}

const AdvancedSearchBox = ({ setSearchTerm, fieldNames }: CustomSearchBoxProps) => {
  const { t } = useTranslation(['advanced', 'common']);
  const [inputs, setInputs] = useState<QueryItem[]>([{ field: 'Select', value: '' }]);

  fieldNames = fieldNames.map((field) => t(field));

  const addInput = () => {
    setInputs([...inputs, { value: '', field: t('Select'), operator: 'AND' }]);
  };

  const removeInput = (index: number) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

  const handleChange = (index: number, { value, operator, field }: QueryItem) => {
    const newInputs = [...inputs];
    if (value != undefined) {
      newInputs[index].value = value;
    } else if (operator) {
      newInputs[index].operator = operator;
    } else if (field) {
      newInputs[index].field = field;
    }
    setInputs(newInputs);
  };

  const handleSubmit = (event: FormEvent) => {
    console.log('Envio iniciado');
    event.preventDefault();
    if (inputs.length === 0 || !isFormValid) return;

    let formatted = `(${inputs[0].field}:${inputs[0].value})`;

    for (let i = 1; i < inputs.length; i++) {
      const row = inputs[i];
      formatted += ` ${row.operator} (${row.field}:${row.value})`;
    }
    setSearchTerm(formatted);
    console.log(`Envio formatado: ${formatted}`);
  };

  useEffect(() => {
    // getIndexStats(indexLabel, setDocsCount);
  }, []);

  const isFormValid = inputs.some(
    (input) =>
      input.field !== '' && input.field !== 'Select' && input.value?.trim() !== '' && input.value.trim().length >= 3
  );

  return (
    <>
      <div className="d-flex flex-column advanced">
        <form className={styles.advancedSearch} onSubmit={handleSubmit}>
          {inputs.map((campo, index) => (
            <div className={`d-flex align-content-center ${styles.container}`} key={index}>
              <div className={`d-flex flex-gap-0 ${styles.group}`}>
                {index > 0 && (
                  <select
                    value={campo.operator}
                    onChange={(e) => handleChange(index, { operator: e.target.value } as QueryItem)}
                    className={`form-select ${styles.op}`}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="AND NOT">AND NOT</option>
                  </select>
                )}
                <input
                  value={campo.value}
                  onChange={(e) => handleChange(index, { value: e.target.value } as QueryItem)}
                  type="text"
                  className={`sui-search-box__text-input ${index === 0 ? styles.firstInput : ''}`}
                />
                <select
                  value={campo.field}
                  onChange={(e) => handleChange(index, { field: e.target.value } as QueryItem)}
                  className="form-select"
                >
                  <option value="Select">{t('Select')}</option>
                  {fieldNames.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
              {index > 0 && (
                <span onClick={() => removeInput(index)} className="d-flex align-items-center">
                  <IoClose />
                </span>
              )}
            </div>
          ))}
          <div className="d-flex flex-justify-content-between">
            <button type="button" className="btn-link d-flex align-items-center flex-gap-8" onClick={addInput}>
              <IoAdd />
              Adicionar campo
            </button>
            <button disabled={!isFormValid} className="btn btn-primary search-button" type="submit">
              <IoSearch /> {t('Search')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default withSearch(({ setSearchTerm }) => ({
  setSearchTerm,
}))(AdvancedSearchBox);
