/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import archiver from 'archiver';
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
    const { query, index, totalResults, indexName } = req.body;
    createFolderIfNotExists(process.env.DOWNLOAD_FOLDER_PATH);
    const fileName = getFileName(index, JSON.stringify(query));
    const zipFilePath = `${process.env.DOWNLOAD_FOLDER_PATH}/${fileName}.zip`;
    if (fs.existsSync(zipFilePath)) {
      console.log('Arquivo já existe. Retornando o caminho.');
      return res.json({ file: zipFilePath });
    }
    if (totalResults > 1000) {
      const { email, captcha } = req.body;
      const response = await googleCaptchaValidation(captcha);
      const captchaValidation = await response.json();
      // @ts-ignore
      if (captchaValidation.success) {
        backgroundExportation(zipFilePath, index, query, email, indexName);
      }
      return res.json({});
    }
    await writeFile(zipFilePath, index, query, indexName);
    res.json({ file: zipFilePath });
  } catch (err) {
    console.error('ERROR::', err);
    res.status(400).json({ error: err.message });
  }
};

async function writeFile(zipFilePath: string, index: string, query: string, indexName: string) {
  try {
    const csvFilePath = await writeCsvFile(zipFilePath, index, query);
    writeZipFile(indexName, zipFilePath, csvFilePath);
    return zipFilePath;
  } catch (err) {
    throw err;
  }
}

async function writeCsvFile(zipFilePath: string, index: string, query: string) {
  const params: Search = {
    index: index,
    scroll: '30s',
    size: 1000,
    // _source: ['name'],
    body: {
      query: query,
    },
  };
  let writeStream;
  try {
    const csvFilePath = zipFilePath.replace('.zip', '.csv');
    writeStream = fs.createWriteStream(csvFilePath);
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
    return csvFilePath;
  } catch (err) {
    throw err;
  } finally {
    console.log('close writeStream');
    writeStream?.end();
  }
}

function writeZipFile(indexName: string, zipFilePath: string, csvFilePath: string) {
  const fileName = `${indexName}-${new Date().toISOString()}.csv`;

  // Crie um objeto de arquivo zip
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip');
  // Manipuladores de eventos para o objeto de arquivo zip
  output.on('close', function () {
    console.log('Arquivo zip criado com sucesso.');
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

async function backgroundExportation(
  zipFilePath: string,
  index: string,
  query: string,
  email: string,
  indexName: string
) {
  console.log('Iniciando processamento da exportação em background.');
  await writeFile(zipFilePath, index, query, indexName);
  const recipient = email;
  const subject = `Download do arquivo CSV`;
  const text = ``;
  const link = `${process.env.BRCRIS_HOST_BASE}/api/download?fileName=${zipFilePath}&indexName=${indexName}`;
  const html = `<p>Prezado usuário,</p>
  <p>Seu arquivo CSV está pronto e pode ser baixado através do link <a href="${link}">${link}</a></p>
  <p>O arquivo ficará disponível para download por 24 horas.</p>
  <p>Atenciosamente, equipe BrCris.</p>`;
  console.log('Enviando email em background.');
  await sendMail({ recipient, subject, text, html });
  console.log('Exportação em background concluída com sucesso!');
}

export default proxy;
