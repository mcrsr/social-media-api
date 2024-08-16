const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error',
        details: err.details || null,
    });
};

module.exports = errorHandler;
