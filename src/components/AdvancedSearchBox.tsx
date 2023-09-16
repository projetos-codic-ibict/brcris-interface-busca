/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBox, withSearch } from '@elastic/react-search-ui';
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface CustomSearchBoxProps extends SearchContextState {
  updateQueryConfig: (advancedQuery: string) => void;
}

const AdvancedSearchBox = ({ searchTerm, setSearchTerm, updateQueryConfig }: CustomSearchBoxProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [field, setField] = useState('All fields');
  const [value, setValue] = useState('');
  const [op, setOp] = useState('&');
  const [fullQuery, setFullQuery] = useState(searchTerm || '');

  const handleQueryChange = () => {
    const newQuery = `${field}=${value}${fullQuery ? `${op}` : ''}`;
    setFullQuery(fullQuery ? `(${newQuery}${fullQuery})` : `${newQuery}${fullQuery}`);
  };

  return (
    <div className="d-flex flex-column flex-gap-1 advanced">
      <p className="">Advanced Search</p>
      <div className="d-flex flex-gap-1">
        <select
          id={`field`}
          onChange={(e) => {
            setField(e.target.value);
          }}
          className="form-select"
        >
          <option selected={field == 'All field'} value="All fields">
            All fields
          </option>
          <option value="title_text">Title</option>
          <option value="keyword_text">Keyword</option>
        </select>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="text"
          id={`value`}
          className="sui-search-box__text-input"
        />
        <select
          hidden={fullQuery == ''}
          id={`op`}
          onChange={(e) => {
            setOp(e.target.value);
          }}
          className="form-select"
        >
          <option value="&">AND</option>
          <option value="|">OR</option>
          <option value="!">NOT</option>
        </select>
        <button
          className="btn btn-secondary"
          onClick={() => {
            handleQueryChange();
          }}
        >
          +
        </button>
      </div>
      <SearchBox
        onSubmit={(searchTerm) => {
          searchTerm = fullQuery || searchTerm;
          updateQueryConfig(fullQuery);
          setSearchTerm(fullQuery);
          router.query.q = `advanced=true&&${searchTerm}`;
          router.push(router);
        }}
        view={({ onChange, onSubmit }) => (
          <form onSubmit={onSubmit} className="d-flex flex-gap-1 align-items-center">
            <textarea
              className="sui-search-box__text-input"
              value={fullQuery}
              readOnly
              id="searchTerm"
              onChange={(e) => {
                setFullQuery(e.target.value);
                onChange(e.target.value);
              }}
            ></textarea>
            <span onClick={() => setFullQuery('')}>X</span>
            <input type="submit" value={t('Search') || 'Search'} className="button sui-search-box__submit" />
          </form>
        )}
      />
    </div>
  );
};

export default withSearch(({ searchTerm, setSearchTerm }) => ({
  searchTerm,
  setSearchTerm,
}))(AdvancedSearchBox);
