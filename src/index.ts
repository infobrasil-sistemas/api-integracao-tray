import logger from './utils/logger';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API RODANDO.');
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
