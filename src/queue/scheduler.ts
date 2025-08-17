// src/queue/scheduler.ts
import { jobQueue } from './queue';
import logger from '../utils/logger';

const TZ = 'America/Fortaleza';

// IDs fixos para conseguir atualizar/remover sem duplicar
const SCHED_IDS = {
  estoques: 'sched:estoques',
  categorias: 'sched:categorias',
  produtos: 'sched:produtos',
};

export async function upsertSchedulers() {
  // (idempotente) remove antes caso já existam — evita duplicar se você mudar o pattern
  for (const id of Object.values(SCHED_IDS)) {
    await jobQueue.removeJobScheduler(id).catch(() => {});
  }

  // Estoques: a cada 1 minuto, no segundo 0
  await jobQueue.upsertJobScheduler(
    SCHED_IDS.estoques,
    { pattern: '0 */1 * * * *', tz: TZ }, // cron de 6 campos (segundo no início)
    {
      name: 'estoques',
      data: { jobType: 'estoques', payload: { task: 'Sincronizar estoques' }, priority: 1 },
      opts: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 10_000 },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }
  );

  // Categorias: a cada 30 minutos
  await jobQueue.upsertJobScheduler(
    SCHED_IDS.categorias,
    { pattern: '0 */30 * * * *', tz: TZ },
    {
      name: 'categorias',
      data: { jobType: 'categorias', payload: { task: 'Sincronizar categorias' }, priority: 1 },
      opts: { attempts: 3, backoff: { type: 'exponential', delay: 10_000 }, removeOnComplete: true, removeOnFail: 100 },
    }
  );

  // Produtos: a cada 10 minutos
  await jobQueue.upsertJobScheduler(
    SCHED_IDS.produtos,
    { pattern: '0 */10 * * * *', tz: TZ },
    {
      name: 'produtos',
      data: { jobType: 'produtos', payload: { task: 'Sincronizar produtos' }, priority: 1 },
      opts: { attempts: 3, backoff: { type: 'exponential', delay: 10_000 }, removeOnComplete: true, removeOnFail: 100 },
    }
  );

  logger.info('Schedulers upsertados com sucesso.');
}

// Auxiliares (opc.)
export async function listSchedulers() {
  const all = await jobQueue.getJobSchedulers(0, 100, true);
  return all.map(s => ({ id: s.id, key: s.key, next: s.next }));
}

export async function removeScheduler(id: string) {
  await jobQueue.removeJobScheduler(id);
}
