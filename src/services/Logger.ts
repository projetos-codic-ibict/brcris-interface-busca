import pino from 'pino';
import { createFolderIfNotExists } from './createFolderIfNotExists';

const config = {
  level: 'info',
  formatters: {
    level: (label: string) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toLocaleString()}"`,
};

createFolderIfNotExists(process.env.LOG_FOLDER_PATH);

const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `${process.env.LOG_FOLDER_PATH}/app.log` },
});

const logger = pino(config, fileTransport);

logger.info(`LOG_FOLDER_PATH:${process.env.LOG_FOLDER_PATH}`);
logger.info(`API_KEY:${process.env.API_KEY}`);
logger.info(`AIL_SENDER:${process.env.MAIL_SENDER}`);
logger.info(`MAIL_PASSWORD:${process.env.MAIL_PASSWORD}`);
logger.info(`MAIL_HOST:${process.env.MAIL_HOST}`);
logger.info(`RECAPTCHA_SECRET_KEY:${process.env.RECAPTCHA_SECRET_KEY}`);

export default logger;
