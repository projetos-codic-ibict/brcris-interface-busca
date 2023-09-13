/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ElasticsearchAPIConnector from '@elastic/search-ui-elasticsearch-connector';
import { NextApiRequest, NextApiResponse } from 'next';
// https://docs.elastic.co/search-ui/api/connectors/elasticsearch#customise-the-elasticsearch-request-body
function builConnector(index: string) {
  const connector = new ElasticsearchAPIConnector(
    {
      host: process.env.HOST_ELASTIC,
      index: index || '',
      apiKey: process.env.API_KEY,
    },
    (requestBody, requestState, queryConfig) => {
      // requestBody.track_total_hits = true;
      console.log('queryConfig: >', queryConfig);
      console.log('searchTerm: ', requestState.searchTerm);
      if (!requestState.searchTerm) return requestBody;

      // transforming the query before sending to Elasticsearch using the requestState and queryConfig
      const searchFields: any = queryConfig.search_fields;
      requestBody.query = {
        multi_match: {
          query: requestState.searchTerm,
          // @ts-ignore
          operator: queryConfig.operator,
          fields: Object.keys(searchFields).map((fieldName) => {
            const weight = searchFields[fieldName].weight || 1;
            return `${fieldName}^${weight}`;
          }),
        },
      };

      return requestBody;
    }
  );
  return connector;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('passou aqui');
    const { requestState, queryConfig } = req.body;
    const connector = builConnector(queryConfig.index);
    const response = await connector.onSearch(requestState, queryConfig);
    res.json(response);
  } catch (e) {
    console.error(e);
    res.json({});
  }
}
