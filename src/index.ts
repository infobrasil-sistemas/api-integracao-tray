import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';

import { sincronizarCategorias } from './jobs/sincronizarCategorias';
import { sincronizarProdutos } from './jobs/sincronizarProdutos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API RODANDO.');
});

app.listen(PORT, async () => {
  logger.log({
    level: 'info',
    message: `API rodando na porta ${PORT}.`
  });

  await sincronizarCategorias()
  await sincronizarProdutos()
});
