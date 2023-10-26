/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBox, withSearch } from '@elastic/react-search-ui';
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { IoAdd, IoArrowUndoOutline, IoClose, IoSearch } from 'react-icons/io5';
import ElasticSearchStatsService from '../services/ElasticSearchStatsService';
import styles from '../styles/AdvancedSearch.module.css';
import { QueryItem } from '../types/Entities';
import HelpModal from './HelpModal';

interface CustomSearchBoxProps extends SearchContextState {
  indexName: string;
  fieldNames: string[];
  toogleAdvancedConfig: (advanced: boolean) => void;
}

const AdvancedSearchBox = ({
  searchTerm,
  setSearchTerm,
  indexName,
  fieldNames,
  toogleAdvancedConfig,
}: CustomSearchBoxProps) => {
  const { t } = useTranslation('common');
  const [docsCount, setDocsCount] = useState(localStorage.getItem(indexName));
  const [query, setQuery] = useState(searchTerm);
  const [queryField, setQueryField] = useState('all');
  const [inputs, setInputs] = useState<QueryItem[]>([]);

  const addInput = () => {
    setInputs([...inputs, { value: '', field: fieldNames[0], operator: 'AND' }]);
  };

  const removeInput = (indice: number) => {
    const newInputs = [...inputs];
    newInputs.splice(indice, 1);
    setInputs(newInputs);
  };

  const handleChange = ({ value, operator, field }: QueryItem, indice: number) => {
    const newInputs = [...inputs];
    if (value != undefined) {
      newInputs[indice].value = value;
    } else if (operator) {
      newInputs[indice].operator = operator;
    } else if (field) {
      newInputs[indice].field = field;
    }
    setInputs(newInputs);
  };

  function getFormatedQuery() {
    //@ts-ignore
    const isAdvancedQuery = query?.indexOf('(') >= 0 && query?.indexOf(':') >= 0;
    let fullQuery = isAdvancedQuery ? query?.trim() : `(${queryField}:${query})`;
    fullQuery = fullQuery + inputs.map((campo) => ` ${campo.operator} (${campo.field}:${campo.value})`).join(' ');
    setQuery(fullQuery);
    setInputs([]);
    return fullQuery;
  }

  useEffect(() => {
    ElasticSearchStatsService(indexName)
      .then((res) => {
        const count = res['docs.count'];
        localStorage.setItem(indexName, count);
        setDocsCount(count);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="d-flex flex-column advanced">
        <div className={styles.advancedSearch}>
          <div className={`d-flex align-content-center ${styles.container}`}>
            <div className={`d-flex flex-gap-0 ${styles.group}`}>
              <textarea
                value={query}
                placeholder={`${t('Enter at least 3 characters and search among')} ${t('numberFormat', {
                  value: docsCount,
                })} ${t('documents')}`}
                onChange={(e) => setQuery(e.target.value)}
                rows={1}
                className="sui-search-box__text-input"
              ></textarea>
              <HelpModal />
              <select className="form-select" value={queryField} onChange={(e) => setQueryField(e.target.value)}>
                <option value="all">{t('All fields')}</option>
                {fieldNames.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>
            <SearchBox
              onSubmit={() => {
                const fullQuery = getFormatedQuery();
                setSearchTerm(fullQuery || '');
              }}
              view={({ onSubmit }) => (
                <form onSubmit={onSubmit} className="d-flex flex-gap-8 align-items-center sui-search-box ">
                  <button type="submit" className="button sui-search-box__submit d-flex align-items-center flex-gap-8">
                    <IoSearch />
                    {t('Search')}
                  </button>
                </form>
              )}
            />
          </div>
          {inputs.map((campo, indice) => (
            <div className={`d-flex align-content-center ${styles.container}`} key={indice}>
              <div className={`d-flex flex-gap-0 ${styles.group}`}>
                <select
                  value={campo.operator}
                  onChange={(e) => handleChange({ operator: e.target.value }, indice)}
                  className={`form-select ${styles.op}`}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value="AND NOT">AND NOT</option>
                </select>
                <input
                  value={campo.value}
                  onChange={(e) => handleChange({ value: e.target.value }, indice)}
                  type="text"
                  className="sui-search-box__text-input"
                />
                <select
                  value={campo.field}
                  onChange={(e) => handleChange({ field: e.target.value }, indice)}
                  className="form-select"
                >
                  {fieldNames.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>
              <span onClick={() => removeInput(indice)} className="d-flex align-items-center">
                <IoClose />
              </span>
            </div>
          ))}
          <div className="d-flex justify-content-center ">
            <button className="btn-link d-flex align-items-center flex-gap-8" onClick={addInput}>
              <IoAdd />
              Adicionar campo
            </button>
          </div>
        </div>

        <span onClick={() => toogleAdvancedConfig(false)} className="link-color d-flex align-items-center flex-gap-8">
          <IoArrowUndoOutline />
          {t('Basic search')}
        </span>
      </div>
    </>
  );
};

export default withSearch(({ searchTerm, setSearchTerm }) => ({
  searchTerm,
  setSearchTerm,
}))(AdvancedSearchBox);
