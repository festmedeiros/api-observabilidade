const logger = require('../logger-winston');

function requestLogger(req, res, next) {
  const startTime = Date.now();

  logger.info('Requisição recebida', {
    method: req.method,
    route: req.originalUrl,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
    origin: req.get('origin'),
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;

    logger.info('Resposta enviada', {
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      durationMs
    });
  });

  next();
}

module.exports = requestLogger;