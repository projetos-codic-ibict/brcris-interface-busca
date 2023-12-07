// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const fileName: string = (req.query.fileName as string) || (req.query.filename as string);
  console.log('fileName', fileName);
  const csvFile = fs.readFileSync(fileName, 'utf-8');
  res
    .status(200)
    .setHeader('Content-Type', 'text/csv')
    .setHeader('Content-Disposition', `attachment; filename=${fileName}`)
    .send(csvFile);
}
