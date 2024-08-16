const winston = require('winston');
const { format, transports } = winston;
const morgan = require('morgan');

// Create a Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'combined.log' }),
        new transports.Console()
    ],
});

// Morgan middleware setup
const requestLogger = morgan('combined', {
    stream: {
        write: message => logger.info(message.trim())
    }
});

module.exports = { logger, requestLogger };
