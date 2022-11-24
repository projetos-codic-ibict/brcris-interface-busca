/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (
  filters: any,
  searchTerm: string | undefined,
  fieldSearch: string | undefined
) => {
  console.log('consultando', fieldSearch)
  const body = JSON.stringify([
    {
      filters,
      searchTerm,
      fieldSearch,
      indicator: 'publicationDate.keyword',
    },
    { filters, searchTerm, fieldSearch, indicator: 'type.keyword' },
  ])
  const response = await fetch('/api/indicators', {
    method: 'POST',

    body: body,
  })
  return response.json()
}

export default proxy
