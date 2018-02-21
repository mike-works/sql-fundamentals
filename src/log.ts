import * as winston from 'winston';

type LoggerMethod = (msg: string, ...meta: any[]) => Logger;

interface Logger {
  debug: LoggerMethod;
  verbose: LoggerMethod;
  info: LoggerMethod;
  warn: LoggerMethod;
  error: LoggerMethod;
}

export const logger: Logger = winston;
