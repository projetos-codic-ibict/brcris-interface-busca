import { withSearch } from '@elastic/react-search-ui';
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch';
import { useTranslation } from 'next-i18next';

function ClearFilters({ filters, searchTerm, setSearchTerm, clearFilters }: SearchContextState) {
  const { t } = useTranslation('common');
  return searchTerm || (filters && filters.length > 0) ? (
    <div>
      <button
        className="btn btn-secondary"
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

export default withSearch(({ filters, searchTerm, setSearchTerm, clearFilters }) => ({
  filters,
  searchTerm,
  setSearchTerm,
  clearFilters,
}))(ClearFilters);
