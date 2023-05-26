/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'es7'

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST_ELASTIC,
  auth: {
    apiKey: process.env.API_KEY || '',
  },
})

const indexesNames = process.env.ELASTIC_INDEXES?.split(',')

const proxy = async (req: any, res: any) => {
  const { body } = await client.cat.indices({
    format: 'json',
    index: indexesNames,
  })
  res.json(body)
}

export default proxy
