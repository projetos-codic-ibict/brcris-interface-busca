/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchBox } from '@elastic/react-search-ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const VIVO_URL_ITEM_BASE = process.env.VIVO_URL_ITEM_BASE;

type CustomSearchBoxProps = {
  titleFieldName: string;
  itemLinkPrefix: string;
  updateOpetatorConfig: (operator: string) => void;
};

const CustomSearchBox = ({ titleFieldName, itemLinkPrefix, updateOpetatorConfig }: CustomSearchBoxProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
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
    ></SearchBox>
  );
};

export default CustomSearchBox;
