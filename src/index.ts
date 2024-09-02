import express from 'express';
import dotenv from 'dotenv';
import { cadastrarProdutos } from './functions/produtos/cadastrarProdutos';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API RODANDO.');
});

app.listen(PORT, () => {
  logger.log({
    level: 'info',
    message: `API rodando na porta ${PORT}.`
  });
  cadastrarProdutos()
});
