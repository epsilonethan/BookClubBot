import winston from 'winston';
import moment from 'moment-timezone';

export const logger = winston.createLogger({
    level: 'info', // Default level (info, warn, error, debug)
    format: winston.format.combine(
        winston.format.timestamp({format: () => moment().tz("America/Chicago").format()}),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Logs to console
        new winston.transports.File({ filename: 'bot.log' }) // Logs to a file
    ],
});
