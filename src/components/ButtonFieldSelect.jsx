export default function ButtonFieldSelect({
  title,
  active,
  config,
  searchField,
}) {
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
        config.searchQuery.search_fields = {
          [searchField]: {},
        }
      }}
    >
      {title}
    </button>
  )
}
