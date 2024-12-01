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

const indexesNames: string[] = [
  process.env.INDEX_PUBLICATION!,
  process.env.INDEX_PERSON!,
  process.env.INDEX_ORGUNIT!,
  process.env.INDEX_JOURNAL!,
  process.env.INDEX_PROGRAM!,
  process.env.INDEX_PATENT!,
  process.env.INDEX_GROUP!,
  process.env.INDEX_SOFTWARE!,
];

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = await client.cat.indices({
    format: 'json',
    index: req.query.indexName || indexesNames,
  });
  res.json(body.length == 1 ? body[0] : body);
};

export default proxy;
