// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import logger from './utils/logger';

// seus controllers:
import { inicializarLoja } from './controllers/integracao/inicializarLoja';
import { atualizarLoja } from './controllers/integracao/atualizarLoja';
import { atualizarDadosEnderecoController } from './controllers/integracao/atualizarDadosEnderecoController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get('/', (_req, res) => res.send('API RODANDO.'));

// rotas
app.post(`/lojas/inicializar`, inicializarLoja);
app.put(`/lojas/atualizar`, atualizarLoja);
app.put(`/endereco/atualizar`, atualizarDadosEnderecoController);

// IMPORTANTE: não importe worker aqui.
// (Opcional) Se você NÃO usar o serviço "scheduler", poderia chamar upsertSchedulers() aqui no boot.
// import { upsertSchedulers } from './queue/scheduler';

app.listen(PORT, async () => {
  logger.info(`API rodando na porta ${PORT}.`);
  // Em produção, NÃO limpe a fila (obliterate) aqui.
  // Se quiser agendar via API (em vez do serviço scheduler), descomente:
  // await upsertSchedulers();
});
