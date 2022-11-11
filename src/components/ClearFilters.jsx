import { withSearch } from '@elastic/react-search-ui'

function ClearFilters({ setSearchTerm, clearFilters }) {
  return (
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
  )
}

export default withSearch(({ setSearchTerm, clearFilters }) => ({
  setSearchTerm,
  clearFilters,
}))(ClearFilters)
