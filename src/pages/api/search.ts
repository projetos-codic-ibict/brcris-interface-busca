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
      if (!requestState.searchTerm) return requestBody;

      // transforming the query before sending to Elasticsearch using the requestState and queryConfig
      const searchFields: any = queryConfig.search_fields;
      // @ts-ignore
      if (queryConfig.advanced) {
        let fullQuery = stringify(parseElasticsearchQuery(requestState.searchTerm));
        fullQuery = fullQuery.replace(',null', '');
        console.log('fullQuery: ', fullQuery);
        requestBody.query = JSON.parse(fullQuery);
      } else {
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
      }
      console.log('requestBody: ', JSON.stringify(requestBody));
      return requestBody;
    }
  );
  return connector;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { requestState, queryConfig } = req.body;
    const connector = builConnector(queryConfig.index);
    const response = await connector.onSearch(requestState, queryConfig);
    res.json(response);
  } catch (e) {
    console.error(e);
    res.json({});
  }
}

type BoolType = {
  bool?: {
    must?: any[];
    should?: any[];
  };
};

function parseElasticsearchQuery(input: string) {
  const stack: BoolType[] = [];
  let current: BoolType = {};
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char === '(') {
      // Verifique o próximo operador
      let nextOperator = '|'; // Default operator is OR
      let j = i + 1;
      while (j < input.length) {
        if (input[j] === '|' || input[j] === '&') {
          nextOperator = input[j];
          break;
        }
        j++;
      }
      if (nextOperator === '|') {
        current = { bool: { should: [] } };
        stack.push(current);
      } else if (nextOperator === '&') {
        current = { bool: { must: [] } };
        stack.push(current);
      }

      let x = j + 1;
      while (x < input.length) {
        if (input[x] === '(') {
          const top = stack.pop();
          if (current?.bool?.should) {
            top?.bool?.should?.push({ bool: { should: [] } });
          } else if (current?.bool?.must) {
            top?.bool?.must?.push({ bool: { must: [] } });
          }
          stack.push(current);
          current = top ? top : {};
          break;
        }
        x++;
      }
      // i = j; // Avança para o próximo operador
      i++;
    } else if (char === ')') {
      if (stack.length === 0) {
        throw new Error('Erro de formato na string.');
      }
      const top = stack.pop();
      if (top?.bool?.should) {
        top.bool.should.push(current);
      } else if (top?.bool?.must) {
        top.bool.must.push(current);
      }
      current = top ? top : {};
      i++;
    } else {
      let index = input.indexOf('|', i);
      if (index < 0) {
        index = input.indexOf('&', i);
      }

      const fields = [];

      if (index > i) {
        fields.push(input.substring(i, index));
      }
      let nextIndex = index + 1;
      const chars = ['|', '&', ')', '('];

      if (fields.length > 0 && !chars.includes(input.charAt(nextIndex))) {
        for (nextIndex; nextIndex < input.length && !chars.includes(input.charAt(nextIndex)); index++) {
          let nextNextIndex = input.indexOf('|', nextIndex);
          if (nextNextIndex < 0) {
            nextNextIndex = input.indexOf('&', nextIndex);
          }
          if (nextNextIndex < 0) {
            nextNextIndex = input.indexOf('(', nextIndex);
          }
          if (nextNextIndex < 0) {
            nextNextIndex = input.indexOf(')', nextIndex);
          }
          if (nextNextIndex > 0) {
            index = nextNextIndex;
            fields.push(input.substring(nextIndex, nextNextIndex));
            nextIndex = nextNextIndex;
          }
        }
      }

      if (fields.length > 0) {
        fields.forEach((field) => {
          if (current?.bool?.must) {
            if (
              current.bool.must &&
              current.bool.must[0] &&
              current.bool.must[0].bool &&
              current.bool.must[0].bool.must
            ) {
              current.bool.must[0].bool.must.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            } else {
              current.bool.must.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            }
          } else if (current?.bool?.should) {
            if (
              current.bool.should &&
              current.bool.should[0] &&
              current.bool.should[0].bool &&
              current.bool.should[0].bool.should
            ) {
              current.bool.should[0].bool.should.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            } else {
              current.bool.should.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            }
          }
        });
      }

      index > i ? (i = index) : i++;
    }
  }

  if (stack.length !== 0) {
    throw new Error('Erro de formato na string.');
  }

  return current;
}

function stringify(obj: object) {
  let cache: any = [];
  const str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}
