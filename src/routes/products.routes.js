const express = require('express');
const logger = require('../logger-winston');

const router = express.Router();

let products = [
  { id: 1, name: 'Notebook', price: 3500 },
  { id: 2, name: 'Mouse', price: 120 }
];

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get('/products', async (req, res) => {
  try {
    logger.info('Iniciando listagem de produtos', {
      route: req.originalUrl
    });

    res.status(200).json(products);
  } catch (error) {
    logger.error('Erro ao listar produtos', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      message: 'Erro ao listar produtos'
    });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/products/:id', async (req, res) => {
  try {
    logger.info('Buscando produto por ID', {
      route: req.originalUrl,
      params: req.params
    });

    const id = Number(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    logger.error('Erro ao buscar produto por ID', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });

    res.status(500).json({
      message: 'Erro ao buscar produto'
    });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post('/products', async (req, res) => {
  try {
    logger.info('Criando novo produto', {
      route: req.originalUrl,
      body: req.body
    });

    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: 'Campos name e price são obrigatórios'
      });
    }

    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      name,
      price
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    logger.error('Erro ao criar produto', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });

    res.status(500).json({
      message: 'Erro ao criar produto'
    });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.put('/products/:id', async (req, res) => {
  try {
    logger.info('Atualizando produto', {
      route: req.originalUrl,
      params: req.params,
      body: req.body
    });

    const id = Number(req.params.id);
    const { name, price } = req.body;

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    products[index] = {
      ...products[index],
      name: name ?? products[index].name,
      price: price ?? products[index].price
    };

    res.status(200).json(products[index]);
  } catch (error) {
    logger.error('Erro ao atualizar produto', {
      message: error.message,
      stack: error.stack,
      params: req.params,
      body: req.body
    });

    res.status(500).json({
      message: 'Erro ao atualizar produto'
    });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/products/:id', async (req, res) => {
  try {
    logger.info('Removendo produto', {
      route: req.originalUrl,
      params: req.params
    });

    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const removedProduct = products[index];
    products.splice(index, 1);

    res.status(200).json({
      message: 'Produto removido com sucesso',
      removedProduct
    });
  } catch (error) {
    logger.error('Erro ao remover produto', {
      message: error.message,
      stack: error.stack,
      params: req.params
    });

    res.status(500).json({
      message: 'Erro ao remover produto'
    });
  }
});

/**
 * @swagger
 * /products-error-demo:
 *   get:
 *     summary: Endpoint proposital para demonstrar erro não tratado pelo middleware global
 *     tags: [Products]
 *     responses:
 *       404:
 *         description: Produto não encontrado
 */
router.get('/products-error-demo', async (req, res, next) => {
  try {
    logger.info('Executando endpoint de demonstração de erro não tratado', {
      route: req.originalUrl
    });

    throw new Error('Erro proposital para demonstração');
  } catch (error) {
    next(error);
  }
});

module.exports = router;