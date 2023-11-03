/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBox } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoArrowRedoOutline, IoSearch } from 'react-icons/io5';
import ElasticSearchStatsService from '../services/ElasticSearchStatsService';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

export type BasicSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  indexName: string;
  updateOpetatorConfig: (operator: string) => void;
  toogleAdvancedConfig: (advanced: boolean) => void;
};

const BasicSearchBox = ({
  titleFieldName,
  itemLinkPrefix,
  indexName,
  updateOpetatorConfig,
  toogleAdvancedConfig,
}: BasicSearchBoxProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [docsCount, setDocsCount] = useState(localStorage.getItem(indexName));

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
        updateOpetatorConfig('OR');
        router.query.q = searchTerm;
        router.push(router);
      }}
      onSelectAutocomplete={(selection: any, item: any, defaultOnSelectAutocomplete: any) => {
        if (selection.suggestion) {
          updateOpetatorConfig('AND');
          defaultOnSelectAutocomplete(selection);
        } else {
          router.push(`${VIVO_URL_ITEM_BASE}/${itemLinkPrefix}${selection.id.raw}&lang=${router.locale}`);
        }
      }}
      view={({ value, onChange, onSubmit }) => (
        <div>
          <form onSubmit={onSubmit} className="d-flex flex-gap-8 align-items-center">
            <input
              className="sui-search-box__text-input"
              type="text"
              value={value}
              placeholder={`${t('Enter at least 3 characters and search among')} ${t('numberFormat', {
                value: docsCount,
              })} ${t('documents')}`}
              onChange={(e) => onChange(e.target.value)}
            />
            <button
              disabled={value.trim().length < 3}
              className="button sui-search-box__submit d-flex align-items-center flex-gap-8"
              type="submit"
            >
              <IoSearch />
              {t('Search')}
            </button>
          </form>
          <span onClick={() => toogleAdvancedConfig(true)} className="link-color d-flex align-items-center flex-gap-8">
            <IoArrowRedoOutline />
            {t('Advanced search')}
          </span>
        </div>
      )}
    ></SearchBox>
  );
};

export default BasicSearchBox;
