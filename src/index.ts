import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { inicializarLoja } from './controllers/integracao/inicializarLoja';
import { atualizarLoja } from './controllers/integracao/atualizarLoja';
import { agendadorJobs, limparFila } from './queue/queue';
import { atualizarDadosEnderecoController } from './controllers/integracao/atualizarDadosEnderecoController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;
const NAME_BASE_URL = 'api-infobrasil-tray'

app.use(express.json());

app.get(`/`, (req, res) => {
  res.send('API RODANDO.');
});

app.post(`/lojas/inicializar`, inicializarLoja);
app.put(`/lojas/atualizar`, atualizarLoja);
app.put(`/endereco/atualizar`, atualizarDadosEnderecoController);


app.listen(PORT, async () => {
  logger.log({
    level: 'info',
    message: `API rodando na porta ${PORT}.`
  });
  await limparFila()
  await agendadorJobs()
});
