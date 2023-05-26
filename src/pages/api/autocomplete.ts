import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector'

const connector = new ElasticsearchAPIConnector({
  host: process.env.HOST_ELASTIC,
  index: 'pesqdf-publication',
  apiKey: process.env.API_KEY,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const { requestState, queryConfig } = req.body
  const response = await connector.onAutocomplete(requestState, queryConfig)
  res.json(response)
}
