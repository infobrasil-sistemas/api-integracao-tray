// src/queue/worker.ts
import { Worker } from 'bullmq';
import { redisConfig } from '../config/redis';
import logger from '../utils/logger';
import { JobData } from './queue';

import { SincronizarCategorias } from '../jobs/sincronizarCategorias';
import { SincronizarEstoques } from '../jobs/sincronizarEstoques';
import { SincronizarProdutos } from '../jobs/sincronizarProdutos';
import { withTimeout } from '../utils/withTimemout';

export const jobWorker = new Worker<JobData>(
  'jobQueue',
  async (job) => {
    const { jobType } = job.data;
    logger.info(`[${job.id}] Iniciando: ${jobType}`);

    switch (jobType) {
      case 'estoques':
        await withTimeout(SincronizarEstoques(), 30 * 60 * 1000, 'SincronizarEstoques');
        break;
      case 'produtos':
        await withTimeout(SincronizarProdutos(), 5 * 60 * 1000, 'SincronizarProdutos');
        break;
      case 'categorias':
        await withTimeout(SincronizarCategorias(), 5 * 60 * 1000, 'SincronizarCategorias');
        break;
      default:
        throw new Error(`Job não implementado: ${String(jobType)}`);
    }

    logger.info(`[${job.id}] Finalizado: ${jobType}`);
  },
  {
    connection: redisConfig,
    concurrency: 1,                   // nunca roda dois ao mesmo tempo
    lockDuration: 30 * 60 * 1000,      // ajuste ao pior caso (5 min aqui)
    stalledInterval: 60 * 1000,       // verifica travados a cada 60s
    removeOnComplete: { age: 3600, count: 100 },
    removeOnFail: { age: 24 * 3600, count: 200 },
  }
);

jobWorker.on('active', (job) => {
  logger.info(`Processando: ${job.data.jobType} (id=${job.id})`);
});
jobWorker.on('completed', (job) => {
  logger.info(`Concluído: ${job.data.jobType} (id=${job.id})`);
});
jobWorker.on('failed', (job, err) => {
  logger.error(`Falhou: ${job?.data.jobType} (id=${job?.id}) -> ${err?.message ?? err}`);
});
jobWorker.on('stalled', (jobId) => {
  logger.warn(`Job travado (stalled): id=${jobId} — será reprocessado.`);
});
jobWorker.on('error', (err) => {
  logger.error(`Erro no Worker/BullMQ: ${err?.message ?? err}`);
});

// Encerramento gracioso
async function shutdown() {
  try {
    logger.info('Encerrando worker...');
    await jobWorker.close();
    logger.info('Worker encerrado.');
    process.exit(0);
  } catch (e: any) {
    logger.error(`Erro ao encerrar worker: ${e?.message ?? e}`);
    process.exit(1);
  }
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('unhandledRejection', (reason) => {
  logger.error(`unhandledRejection: ${String(reason)}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException: ${err?.message ?? err}`);
  // opcional: process.exit(1);
});
