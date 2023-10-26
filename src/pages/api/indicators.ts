/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client } from 'es7';
import { NextApiRequest, NextApiResponse } from 'next';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data: RequestData = JSON.parse(req.body);
    const querys: any[] = [];
    data.querys.forEach((query) => {
      querys.push({ index: data.index });
      querys.push(query);
    });
    // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/msearch_examples.html
    const { body } = await client.msearch({
      body: querys,
    });

    const buckets = body.responses.map((resp: any) => resp.aggregations?.aggregate.buckets);

    res.json(buckets);
  } catch (err) {
    console.error('ERROR::::', err);
    res.status(400).json({ error: err.message });
  }
};

export default proxy;
