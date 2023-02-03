/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (
  filters: any,
  searchTerm: string | undefined,
  fieldSearch: string | undefined,
  operator: string,
  index: string,
  indicator: string
) => {
  const body = JSON.stringify([
    {
      filters,
      searchTerm,
      fieldSearch,
      operator,
      index,
      indicator: indicator,
    },
    { filters, searchTerm, fieldSearch, operator, index, indicator: 'type.keyword' },
  ])
  const response = await fetch('/api/indicators', {
    method: 'POST',

    body: body,
  })
  return response.json()
}

export default proxy
