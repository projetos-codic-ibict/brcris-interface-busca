import { Client } from 'es7';
import { NextApiRequest, NextApiResponse } from 'next';
import logger from '../../services/Logger';
const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST_ELASTIC,
  auth: {
    apiKey: process.env.API_KEY!,
  },
});

type RequestData = {
  querys: string[];
  index: string;
};

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data: RequestData = JSON.parse(req.body);
    const querys: any[] = [];
    data.querys.forEach((query) => {
      querys.push({ index: data.index });
      querys.push(query);
      console.log('query indicator', query);
    });
    // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/msearch_examples.html
    const { body } = await client.msearch({
      body: querys,
    });

    const buckets = body.responses.map((resp: any) => resp.aggregations?.aggregate.buckets);
    const total = body.responses.map((resp: any) => resp.hits.total.value);
    res.json({ buckets, total });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: err.message });
  }
};

export default proxy;
