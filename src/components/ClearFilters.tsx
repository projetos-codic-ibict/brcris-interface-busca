/* eslint-disable @typescript-eslint/no-unused-vars */
import { withSearch } from '@elastic/react-search-ui';
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch';
import { useTranslation } from 'next-i18next';

function ClearFilters({ filters, searchTerm, setSearchTerm, clearFilters }: SearchContextState) {
  const { t } = useTranslation('common');
  return (
    <div>
      <button
        className="btn btn-clear"
        onClick={() => {
          clearFilters();
          setSearchTerm('');
        }}
      >
        {t('Clear filters')}
      </button>
    </div>
  );
}

export default withSearch(({ filters, searchTerm, setSearchTerm, clearFilters }) => ({
  filters,
  searchTerm,
  setSearchTerm,
  clearFilters,
}))(ClearFilters);
