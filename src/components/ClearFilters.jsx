import { withSearch } from '@elastic/react-search-ui'

function ClearFilters({ filters, searchTerm, setSearchTerm, clearFilters }) {
  return searchTerm || filters.length > 0 ? (
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
