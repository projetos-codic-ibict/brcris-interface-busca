import { Client } from 'es7'

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: 'http://172.16.16.90:9200',
  auth: {
    apiKey: '' + process.env.API_KEY,
  },
})

const query = {
  query: {
    match_all: {},
  },
  _source: ['Ano'],
  size: 0,
  aggs: {
    genres: {
      terms: {
        field: 'Ano',
        size: 1000,
        order: {
          _key: 'desc',
        },
      },
    },
  },
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxy = async (req: any, res: any) => {
  const response = await client.search({
    index: 'observatorio_artigos_prod',
    body: query,
  })
  res.json(response.body.aggregations.genres.buckets)
}

export default proxy
