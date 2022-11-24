import { withSearch } from '@elastic/react-search-ui'
import { SearchContextState } from '@elastic/react-search-ui/lib/esm/withSearch'

function ClearFilters({
  filters,
  searchTerm,
  setSearchTerm,
  clearFilters,
}: SearchContextState) {
  return searchTerm || (filters && filters.length > 0) ? (
    <div>
      <button
        className="btn btn-warning"
        onClick={() => {
          clearFilters()
          setSearchTerm('')
        }}
      >
        Limpar filtros
      </button>
    </div>
  ) : (
    <></>
  )
}

export default withSearch(
  ({ filters, searchTerm, setSearchTerm, clearFilters }) => ({
    filters,
    searchTerm,
    setSearchTerm,
    clearFilters,
  })
)(ClearFilters)
