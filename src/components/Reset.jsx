import { withSearch } from '@elastic/react-search-ui'

function Reset({ reset, title, active, config, searchField }) {
  return (
    <button
      className={active ? 'nav-link active' : 'nav-link'}
      data-bs-toggle="tab"
      data-bs-target="#home"
      type="button"
      role="tab"
      aria-controls="home"
      data-field="title"
      aria-selected="true"
      onClick={() => {
        // reset()
        config.searchQuery.search_fields = {
          [searchField]: {},
        }
      }}
    >
      {title}
    </button>
  )
}

export default withSearch(
  ({ reset }, { title, active, config, searchField }) => ({
    reset,
    title,
    active,
    config,
    searchField,
  })
)(Reset)
