import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector'

const connector = new ElasticsearchAPIConnector({
  host: process.env.HOST,
  index: 'pqseniors-pubs',
  apiKey: process.env.API_KEY,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const { requestState, queryConfig } = req.body
  requestState.searchTerm = requestState.searchTerm.replaceAll(' ', '+')
  const response = await connector.onSearch(requestState, queryConfig)
  res.json(response)
}
