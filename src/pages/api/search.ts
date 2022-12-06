/* eslint-disable @typescript-eslint/no-explicit-any */
import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector'
// https://docs.elastic.co/search-ui/api/connectors/elasticsearch#customise-the-elasticsearch-request-body
const connector = new ElasticsearchAPIConnector(
  {
    host: process.env.HOST,
    index: 'pqseniors-pubs',
    apiKey: process.env.API_KEY,
  },
  (requestBody, requestState, queryConfig) => {
    requestBody.track_total_hits = true
    if (!requestState.searchTerm) return requestBody

    // transforming the query before sending to Elasticsearch using the requestState and queryConfig
    const searchFields: any = queryConfig.search_fields
    requestBody.query = {
      multi_match: {
        query: requestState.searchTerm,
        operator: 'OR',
        // operator: queryConfig.operator,
        fields: Object.keys(searchFields).map((fieldName) => {
          const weight = searchFields[fieldName].weight || 1
          return `${fieldName}^${weight}`
        }),
      },
    }

    return requestBody
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const { requestState, queryConfig } = req.body
  const response = await connector.onSearch(requestState, queryConfig)
  res.json(response)
}
