/* eslint-disable react-hooks/exhaustive-deps */
import { SearchBox } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoArrowRedoOutline, IoSearch } from 'react-icons/io5';
import indexes from '../configs/Indexes';
import { getIndexStats } from '../services/ElasticSearchStatsService';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

export type BasicSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  indexLabel: string;
  setSearchTerm: (searchTerm: string) => void;
  handleSelectIndex: (event: any) => void;
  toogleAdvancedConfig: (advanced: boolean) => void;
};

const BasicSearchBox = ({
  titleFieldName,
  itemLinkPrefix,
  indexLabel,
  setSearchTerm,
  handleSelectIndex,
  toogleAdvancedConfig,
}: BasicSearchBoxProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [docsCount, setDocsCount] = useState(localStorage.getItem(indexLabel));

  useEffect(() => {
    getIndexStats(indexLabel, setDocsCount);
  }, []);

  return (
    <>
      <SearchBox
        autocompleteMinimumCharacters={3}
        searchAsYouType={false}
        autocompleteResults={{
          linkTarget: '_blank',
          sectionTitle: t('Open link') || '',
          titleField: titleFieldName,
          urlField: '',
          shouldTrackClickThrough: true,
        }}
        autocompleteSuggestions={true}
        debounceLength={0}
        onSubmit={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
        onSelectAutocomplete={(selection: any, item: any, defaultOnSelectAutocomplete: any) => {
          if (selection.suggestion) {
            selection.suggestion = `\"${selection.suggestion}\"`;
            defaultOnSelectAutocomplete(selection);
          } else {
            router.push(`${VIVO_URL_ITEM_BASE}/${itemLinkPrefix}${selection.id.raw}?lang=${router.locale}`);
          }
        }}
        inputView={({ getAutocomplete, getInputProps /** getButtonProps **/ }) => (
          <div className="form-search">
            <div className="form-group">
              <div className="custom-select">
                <select
                  defaultValue={indexLabel}
                  id="index-select"
                  onChange={handleSelectIndex}
                  title={t('Select an entity') || ''}
                >
                  {indexes.map((index) => (
                    <option key={index.label} value={index.label}>
                      {t(index.label)}
                    </option>
                  ))}
                </select>
              </div>
              <input
                {...getInputProps({
                  placeholder: `${t('Enter at least 3 characters and search among')} ${t('numberFormat', {
                    value: docsCount || 0,
                  })} ${t('records')}`,
                })}
              />
              {getAutocomplete()}
            </div>

            <button disabled={getInputProps()?.value?.trim().length < 3} className="btn btn-primary">
              <IoSearch /> {t('Search')}
            </button>
          </div>
        )}
      ></SearchBox>
      <span onClick={() => toogleAdvancedConfig(true)} className="link-color d-flex align-items-center flex-gap-8">
        <IoArrowRedoOutline />
        {t('Advanced search')}
      </span>
    </>
  );
};

export default BasicSearchBox;
