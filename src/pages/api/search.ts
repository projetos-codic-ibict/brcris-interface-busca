import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector'

const connector = new ElasticsearchAPIConnector({
  host: 'http://172.16.16.90:9200',
  index: 'observatorio_artigos_prod',
  apiKey: 'NDNHbXNvTUJiMHM1anQ5THQ1ZEI6Vk4xWXRtcWNSNS03WmFsOVd0TXhEZw==',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const { requestState, queryConfig } = req.body
  const response = await connector.onSearch(requestState, queryConfig)
  res.json(response)
}
