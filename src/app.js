require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const productsRoutes = require('./routes/products.routes');
const requestLogger = require('./middlewares/request-logger.middleware');
const errorHandler = require('./middlewares/error-handler.middleware');
const logger = require('./logger-winston');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware de logging de requisição
app.use(requestLogger);

// Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use(productsRoutes);

// Health check simples
app.get('/', (req, res) => {
  res.json({
    message: 'API de observabilidade rodando com sucesso'
  });
});

// Middleware global de tratamento de erros
app.use(errorHandler);

// Captura de erros não tratados fora do fluxo do Express
process.on('uncaughtException', (error) => {
  logger.error('uncaughtException capturada', {
    message: error.message,
    stack: error.stack
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error('unhandledRejection capturada', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : null
  });
});

app.listen(PORT, () => {
  logger.info('Servidor iniciado com sucesso', {
    port: PORT,
    swagger: `http://localhost:${PORT}/swagger`
  });

  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Swagger disponível em http://localhost:${PORT}/swagger`);
});