
import { redisConfig } from '../config/redis';
import { Queue } from 'bullmq';
import logger from '../utils/logger';
import cron from 'node-cron';

export type JobType = 'categorias' | 'produtos' | 'estoques' | 'pedidos';

export interface JobData {
  jobType: JobType;
  payload: any;
  priority: number
}

export const jobQueue = new Queue<JobData>('jobQueue', {
  connection: redisConfig,
});

export const addJob = async (
  jobType: JobData['jobType'],
  payload: any,
  priority: number
) => {
  await jobQueue.add(
    jobType,
    { jobType, payload, priority },
    { priority }
  );
};

export const agendadorJobs = async () => {
  try {
    // Agendador para "estoques" - Rodará no início de cada minuto
    cron.schedule('0 * * * * *', async () => {
      await addJob('estoques', { task: 'Sincronizar estoques' }, 1);
    });

    // Agendador para "pedidos" - Rodará aos 15 segundos de cada minuto
    cron.schedule('0 * * * * *', async () => {
      await addJob('pedidos', { task: 'Sincronizar pedidos' }, 2);
    });

    // Agendador para "produtos" - Rodará aos 30 segundos de cada minuto
    cron.schedule('0 * * * * *', async () => {
      await addJob('produtos', { task: 'Sincronizar produtos' }, 3);
    });

    // Agendador para "categorias" - Rodará aos 45 segundos de cada minuto
    cron.schedule('0 * * * * *', async () => {
      await addJob('categorias', { task: 'Sincronizar categorias' }, 4);
    });

    logger.log({
      level: 'info',
      message: 'Jobs agendados com sucesso.',
    });
  } catch (error: any) {
    logger.log({
      level: 'error',
      message: `Erro ao agendar os jobs: ${error.message}`,
    });
  }
};

export const limparFila = async () => {
  const queue = new Queue('jobQueue', { connection: redisConfig });

  await queue.obliterate({ force: true });

  logger.log({
    level: 'info',
    message: 'Fila limpa com sucesso.',
  });
}
