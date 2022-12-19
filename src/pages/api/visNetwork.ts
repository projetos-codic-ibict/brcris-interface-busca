/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from 'es7'

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST_ELASTIC,
  auth: {
    apiKey: process.env.API_KEY!,
  },
})

const query = {
  query: {
    match_all: {},
  },
  size: 20,
  from: 2,
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const autores = async (req: any, res: any) => {
  const response = await client.search({
    index: 'pubs-test-jesiel',
    body: query,
  })
  res.json(response.body.hits.hits)
}

export default autores
