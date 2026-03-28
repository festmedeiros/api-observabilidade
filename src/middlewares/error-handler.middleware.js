const logger = require('../logger-winston');

function errorHandler(err, req, res, next) {
  logger.error('Exceção não tratada capturada pelo middleware global', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    route: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body
  });

  res.status(err.status || 500).json({
    success: false,
    message: 'Erro interno no servidor',
    detail: err.message
  });
}

module.exports = errorHandler;