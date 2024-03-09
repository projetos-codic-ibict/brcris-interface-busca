/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import archiver from 'archiver';
import crypto from 'crypto';
import { Client } from 'es7';
import { Search } from 'es7/api/requestParams';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { csvOptions, jsonToCsv } from '../../services/JsonToCsv';
import logger from '../../services/Logger';
import { createFolderIfNotExists } from '../../services/createFolderIfNotExists';
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
    const { query, index, resultFields, totalResults, indexName } = req.body;
    createFolderIfNotExists(process.env.DOWNLOAD_FOLDER_PATH);
    const fileName = getFileName(index, JSON.stringify(query));
    const zipFilePath = `${process.env.DOWNLOAD_FOLDER_PATH}/${fileName}.zip`;
    if (fs.existsSync(zipFilePath)) {
      logger.info('Arquivo já existe: ', zipFilePath);
      return res.json({ file: zipFilePath });
    }
    logger.info('Iniciando processamento exportação: ', 'arquivo: ', zipFilePath, 'query:', query, 'index:', index);
    if (totalResults > 1000) {
      const { email, captcha } = req.body;
      const response = await googleCaptchaValidation(captcha);
      const captchaValidation = await response.json();
      // @ts-ignore
      if (captchaValidation.success) {
        backgroundExportation(zipFilePath, index, query, email, indexName, resultFields);
      }
      return res.json({});
    }
    await writeFile(zipFilePath, index, query, indexName, resultFields);
    res.json({ file: zipFilePath });
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: err.message });
  }
};

async function writeFile(zipFilePath: string, index: string, query: string, indexName: string, resultFields: string[]) {
  try {
    logger.info('Iniciando writeFile: ', 'arquivo: ', zipFilePath, 'query:', query, 'index:', index);
    const csvFilePath = await writeCsvFile(zipFilePath, index, query, resultFields);
    writeZipFile(indexName, zipFilePath, csvFilePath);
    logger.info('Arquivo criado: ', 'arquivo: ', zipFilePath, 'query:', query, 'index:', index);
    return zipFilePath;
  } catch (err) {
    throw err;
  }
}

async function writeCsvFile(zipFilePath: string, index: string, query: string, resultFields: string[]) {
  const params: Search = {
    index: index,
    scroll: '30s',
    size: 1000,
    _source: resultFields,
    _source_excludes: 'id',
    body: {
      query: query,
    },
  };
  let writeStream;
  try {
    const csvFilePath = zipFilePath.replace('.zip', '.csv');
    writeStream = fs.createWriteStream(csvFilePath);

    const csvHeaders = resultFields.join(csvOptions.delimiter);
    writeStream.write(csvHeaders);
    writeStream.write(csvOptions.eol);

    for await (const hit of scrollSearch(params)) {
      const data = jsonToCsv(hit._source, resultFields);
      writeStream.write(data);
      writeStream.write(csvOptions.eol);
    }
    return csvFilePath;
  } catch (err) {
    throw err;
  } finally {
    logger.info('close writeStream');
    writeStream?.end();
  }
}

function writeZipFile(indexName: string, zipFilePath: string, csvFilePath: string) {
  logger.info('Iniciando writeZipFile: ', 'arquivo: ', zipFilePath);
  const fileName = `${indexName}-${new Date().toISOString()}.csv`;

  // Crie um objeto de arquivo zip
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip');
  // Manipuladores de eventos para o objeto de arquivo zip
  output.on('close', function () {
    // apaga arquivo .csv
    fs.unlinkSync(csvFilePath);
  });
  archive.on('error', function (err) {
    throw err;
  });
  // Pipe do arquivo de saída
  archive.pipe(output);
  // Adiciona o arquivo CSV ao arquivo zip com o nome que desejar
  archive.file(csvFilePath, { name: fileName });
  // Finaliza o processo de arquivamento
  archive.finalize();
  logger.info('Finalizando writeZipFile: ', 'arquivo: ', zipFilePath);
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

async function backgroundExportation(
  zipFilePath: string,
  index: string,
  query: string,
  email: string,
  indexName: string,
  resultFields: string[]
) {
  logger.info('Exportação em background: ', 'arquivo: ', zipFilePath, 'query:', query, 'index:', index);
  await writeFile(zipFilePath, index, query, indexName, resultFields);
  const recipient = email;
  const subject = `Download do arquivo CSV`;
  const text = ``;
  const link = `${process.env.BRCRIS_HOST_BASE}/api/download?fileName=${zipFilePath}&indexName=${indexName}`;
  const html = `<p>Prezado usuário,</p>
  <p>Seu arquivo CSV está pronto e pode ser baixado através do link <a href="${link}">${link}</a></p>
  <p>O arquivo ficará disponível para download por 24 horas.</p>
  <p>Atenciosamente, equipe BrCris.</p>`;
  logger.info('Enviando email em background: ', 'arquivo: ', zipFilePath, 'query:', query, 'index:', index);
  await sendMail({ recipient, subject, text, html });
  logger.info('Email enviado.');
}

export default proxy;
