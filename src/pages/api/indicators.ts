/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from 'es7'
import { Filter } from '@elastic/search-ui'

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST,
  auth: {
    apiKey: process.env.API_KEY!,
  },
})

const queryTextModel = {
  track_total_hits: true,
  _source: [],
  size: 0,
  aggs: {
    aggregate: {
      terms: {
        field: '',
        size: 100000,
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

type RequestData = {
  searchTerm: string
  indicator: string
  filters: Filter[]
}

function fillQuery(data: RequestData) {
  const queryText = JSON.parse(JSON.stringify(queryTextModel))

  if (data.indicator) {
    queryText._source = [data.indicator]
    queryText.aggs.aggregate.terms.field = data.indicator
  }

  if (data.searchTerm) {
    queryText.query.bool.must.query_string.query = data.searchTerm + '*'
  } else {
    queryText.query.bool.must.query_string.query = '*'
  }
  if (data.filters && data.filters.length > 0) {
    queryText.query.bool.filter = []
    data.filters.forEach((filter) => {
      queryText.query.bool.filter.push(getFilterFormated(filter))
    })
  } else {
    queryText.query.bool.filter = []
  }
  return queryText
}

function getFilterFormated(filter: Filter): any {
  if (filter.type === 'none') {
    const matrix = filter.values.map((val) => val.split(' - '))
    const values = [].concat(...matrix)
    values.sort()
    const from = values[0]
    const to = values[values.length - 1]

    console.log('Range: ', from, to)

    return {
      range: {
        [filter.field]: {
          gte: from,
          lte: to,
        },
      },
    }
  }
  return { terms: { [filter.field]: filter.values } }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxy = async (req: any, res: any) => {
  const datas: RequestData[] = JSON.parse(req.body)
  console.log('datas: ', JSON.stringify(datas))
  const querys: any[] = []

  datas.forEach((data) => {
    const queryText = fillQuery(data)
    querys.push({ index: 'pqseniors-pubs' })
    querys.push(queryText)
  })

  // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/msearch_examples.html
  const { body } = await client.msearch({
    body: querys,
  })

  const buckets = body.responses.map(
    (resp: any) => resp.aggregations.aggregate.buckets
  )

  res.json(buckets)
}

export default proxy
