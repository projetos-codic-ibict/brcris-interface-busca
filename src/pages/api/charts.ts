/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from 'es7'

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST,
  auth: {
    apiKey: process.env.API_KEY!,
  },
})

const queryText = {
  _source: ['publicationDate.keyword'],
  size: 0,
  aggs: {
    genres: {
      terms: {
        field: 'publicationDate.keyword',
        size: 100,
        order: {
          _key: 'desc',
        },
      },
    },
  },
  query: {
    bool: {
      must: {
        query_string: {
          query: '*',
        },
      },
      filter: [],
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxy = async (req: any, res: any) => {
  const data = JSON.parse(req.body)

  // if (data.indicator) {
  //   queryText._source = [data.indicator]
  //   queryText.aggs.genres.terms.field = data.indicator
  // }

  console.log(data.filters)

  if (data.searchTerm) {
    queryText.query.bool.must.query_string.query = data.searchTerm
  } else {
    queryText.query.bool.must.query_string.query = '*'
  }
  if (data.filters && data.filters.length > 0) {
    queryText.query.bool.filter = []
    data.filters.forEach((filter) => {
      queryText.query.bool.filter.push({
        term: { [filter.field]: filter.values[0] },
      })
    })
  } else {
    queryText.query.bool.filter = []
  }
  console.log(JSON.stringify(queryText))
  const response = await client.search({
    index: 'pqseniors-pubs',
    body: queryText,
  })
  res.json(response.body.aggregations.genres.buckets)
}

export default proxy
