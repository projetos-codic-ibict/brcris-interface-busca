/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import crypto from 'crypto';
import { Client } from 'es7';
import { Search } from 'es7/api/requestParams';
import fs from 'fs';
import { Json2CsvOptions, json2csv } from 'json-2-csv';
import { NextApiRequest, NextApiResponse } from 'next';
import { googleCaptchaValidation } from './googleCaptchaValidation';
import { sendMail } from './sendMail';

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
  try {
    const { query, index, totalResults } = req.body;

    createFolderIfNotExists(process.env.DOWNLOAD_FOLDER_PATH);

    const fileName = getFileName(index, JSON.stringify(query));
    const filePath = `${process.env.DOWNLOAD_FOLDER_PATH}/${fileName}.csv`;

    if (fs.existsSync(filePath)) {
      console.log('Arquivo já existe. Retornando o caminho.');
      return res.json({ file: filePath });
    }

    if (totalResults > 1000) {
      const { email, captcha } = req.body;
      const response = await googleCaptchaValidation(captcha);
      const captchaValidation = await response.json();
      // @ts-ignore
      if (captchaValidation.success) {
        backgroundExportation(filePath, index, query, email);
      }
      return res.json({});
    }

    await writeFile(filePath, index, query);
    res.json({ file: filePath });
  } catch (err) {
    console.error('ERROR::', err);
    res.status(400).json({ error: err.message });
  }
};

async function backgroundExportation(filePath: string, index: string, query: string, email: string) {
  console.log('Iniciando processamento da exportação em background.');
  console.log('process.env.BRCRIS_HOST_BASE', process.env.BRCRIS_HOST_BASE);
  await writeFile(filePath, index, query);
  const recipient = email;
  const subject = `Download do arquivo CSV`;
  const text = ``;
  const link = `${process.env.BRCRIS_HOST_BASE}/api/download?fileName=${filePath}`;
  const html = `<p>Prezado usuário,</p>
  <p>Seu arquivo CSV está pronto e pode ser baixado através do link <a href="${link}">${link}</a></p>
  <p>O arquivo ficará disponível para download por 24 horas.</p>
  <p>Atenciosamente, equipe BrCris.</p>`;
  console.log('Enviando email em background.');
  await sendMail({ recipient, subject, text, html });
  console.log('Exportação em background concluída com sucesso!');
}

async function writeFile(filePath: string, index: string, query: string) {
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

    writeStream = fs.createWriteStream(filePath);

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
    return filePath;
  } catch (err) {
    throw err;
  } finally {
    console.log('close writeStream');
    writeStream?.end();
  }
}

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

function createFolderIfNotExists(folderPath: string | undefined) {
  if (folderPath && !fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

export default proxy;
