/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import crypto from 'crypto';
import { Client } from 'es7';
import { Search } from 'es7/api/requestParams';
import fs from 'fs';
import { Json2CsvOptions, json2csv } from 'json-2-csv';
import { NextApiRequest, NextApiResponse } from 'next';

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.17/scroll_examples.html

const client = new Client({
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true,
  node: process.env.HOST_ELASTIC,
  auth: {
    apiKey: process.env.API_KEY!,
  },
});

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, index } = req.body;

  let writeStream;
  try {
    const params: Search = {
      index: index,
      scroll: '30s',
      size: 1000,
      // _source: ['name'],
      body: {
        query: query,
      },
    };

    const fileName = getFileName(index, JSON.stringify(query));
    const path = `${process.env.DOWNLOAD_FOLDER_PATH}/${fileName}.csv`;
    const createStream = fs.createWriteStream(path);
    createStream.end();

    writeStream = fs.createWriteStream(path);

    const options: Json2CsvOptions = {
      prependHeader: true,
      delimiter: { field: ';' },
    };

    let isFirstItem = true;

    for await (const hit of scrollSearch(params)) {
      options.prependHeader = isFirstItem;
      writeStream.write(json2csv(hit._source, options));
      writeStream.write('\r\n');
      isFirstItem = false;
    }
    res.json({ file: path });
  } catch (err) {
    console.error('ERROR::', err);
    res.status(400).json({ error: err.message });
  } finally {
    console.log('close writeStream');
    writeStream?.end();
  }
};

// Scroll utility
async function* scrollSearch(params: Search) {
  let response = await client.search(params);

  while (true) {
    const sourceHits = response.body.hits.hits;

    if (sourceHits.length === 0) {
      break;
    }

    for (const hit of sourceHits) {
      yield hit;
    }

    if (!response.body._scroll_id) {
      break;
    }

    response = await client.scroll({
      scroll_id: response.body._scroll_id,
      scroll: params.scroll,
    });
  }
}

function getFileName(index: string, query: string) {
  const string = index + query;
  const hash = crypto.createHash('sha256').update(string).digest('hex');
  return hash;
}

export default proxy;
