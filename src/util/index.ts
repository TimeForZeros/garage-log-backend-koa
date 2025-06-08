import winston from 'winston';
import config from '@config';

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
if (process.env.NODE_ENV !== 'PROD') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    }),
  );
}

export default logger;
