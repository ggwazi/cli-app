import winston from 'winston';

export function createLogger(name: string) {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: name },
    transports: [
      new winston.transports.File({ filename: `logs/${name}-error.log`, level: 'error' }),
      new winston.transports.File({ filename: `logs/${name}.log` }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
}
