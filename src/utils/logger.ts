import winston from 'winston';
import 'winston-daily-rotate-file';

const caminhoBase = `/var/log/integracao-tray`

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: 'error-%DATE%.log',           
      datePattern: 'YYYY-MM-DD',              
      level: 'error',                        
      maxFiles: '7d',                        
      dirname: `${caminhoBase}/errors`,       
      zippedArchive: false,                 
    }),
    // Transporte para logs combinados (todos os níveis), com rotação diária, armazenado em um subdiretório específico
    new winston.transports.DailyRotateFile({
      filename: 'combined-%DATE%.log',       
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
      dirname: `${caminhoBase}/combined`,     
      zippedArchive: false,
    }),
  ],
});

export default logger;
