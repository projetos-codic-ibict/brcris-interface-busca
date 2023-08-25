/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBox } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ElasticSearchStatsService from '../services/ElasticSearchStatsService';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

type CustomSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  indexName: string;
  updateOpetatorConfig: (operator: string) => void;
};

const CustomSearchBox = ({ titleFieldName, itemLinkPrefix, indexName, updateOpetatorConfig }: CustomSearchBoxProps) => {
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
      inputView={({ getAutocomplete, getInputProps, getButtonProps }) => (
        <>
          <div className="sui-search-box__wrapper">
            <input
              {...getInputProps({
                placeholder: `${t('Search among')} ${t('numberFormat', { value: docsCount })} ${t('documents')}`,
              })}
            />
            {getAutocomplete()}
          </div>
          <input
            {...getButtonProps({
              disabled: getInputProps()?.value?.trim().length < 3,
            })}
          />
        </>
      )}
    ></SearchBox>
  );
};

export default CustomSearchBox;
