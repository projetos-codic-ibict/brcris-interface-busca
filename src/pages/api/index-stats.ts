/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'es7';
import { NextApiRequest, NextApiResponse } from 'next';

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST_ELASTIC,
  auth: {
    apiKey: process.env.API_KEY || '',
  },
});

const indexesNames = process.env.ELASTIC_INDEXES?.split(',');

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = await client.cat.indices({
    format: 'json',
    index: req.query.indexName || indexesNames,
  });
  res.json(body.length == 1 ? body[0] : body);
};

export default proxy;
