import express from 'express';
import dotenv from 'dotenv';
import { cadastrarProdutos } from './functions/produtos/cadastrarProdutos';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API RODANDO.');
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
  cadastrarProdutos()
});
