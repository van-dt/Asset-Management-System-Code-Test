import * as winston from 'winston';
import { ErrorMessage } from '../core/enum';

const { combine, timestamp, label, printf } = winston.format;

const date = new Date();
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
const currentDate = date.getDate();

export function getWinstonFormat() {
  const myFormat = printf(({ level, message, _label, timestamp }) => {
    return `[${level.toLocaleUpperCase()}] ${timestamp} Message: ${message}`;
  });
  return combine(label({}), timestamp(), myFormat);
}

export function getWinstonPathFile() {
  return new winston.transports.File({
    filename: `${process.cwd()}/logs/${currentYear}-${currentMonth}-${
      currentDate < 10 ? '0' + currentDate : currentDate
    }_file_log.json`,
    level: 'error',
  });
}

export const handleErrorStatus = (status: number) => {
  switch (status) {
    case 400:
      throw new Error(ErrorMessage.BAD_REQUEST);
    case 404:
      throw new Error(ErrorMessage.NOT_FOUND);
    case 502:
      throw new Error(ErrorMessage.BAD_GATEWAY);
    case 503:
      throw new Error(ErrorMessage.SERVICE_UNAVAILABLE);
    case 504:
      throw new Error(ErrorMessage.GATEWAY_TIMEOUT);
    default:
      throw new Error(ErrorMessage.INTERNAL_SERVER_ERROR);
  }
};
