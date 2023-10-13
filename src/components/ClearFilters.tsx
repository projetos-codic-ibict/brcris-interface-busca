/* eslint-disable @typescript-eslint/no-unused-vars */
import { withSearch } from '@elastic/react-search-ui';
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch';
import { useTranslation } from 'next-i18next';

function ClearFilters({ filters, searchTerm, resultSearchTerm, setSearchTerm, clearFilters }: SearchContextState) {
  const { t } = useTranslation('common');
  return resultSearchTerm || (filters && filters.length > 0) ? (
    <div>
      <button
        className="btn btn-link"
        onClick={() => {
          clearFilters();
          setSearchTerm('');
        }}
      >
        {t('Clear filters')}
      </button>
    </div>
  ) : (
    <></>
  );
}

export default withSearch(({ filters, searchTerm, resultSearchTerm, setSearchTerm, clearFilters }) => ({
  filters,
  searchTerm,
  resultSearchTerm,
  setSearchTerm,
  clearFilters,
}))(ClearFilters);
