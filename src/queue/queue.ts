import Queue from 'bull';
import * as jobs from '../jobs/index';
import redisConfig from '../config/redis'

type RuntimeJobs = typeof jobs;

export const cronQueues = Object.values(jobs).filter(job => job.options.repeat).map((job) => {
  const bullQueue = new Queue(job.key, redisConfig);

  // Remove registros antigos de repeat no Redis
  bullQueue.clean(0, 'delayed').then(() => {
    console.log(`Registros antigos removidos para a fila: ${job.key}`);
    // Adiciona o job com o novo repeat
    bullQueue.add(null, job.options);
  })
  
  return {
    bull: bullQueue,
    name: job.key,
    handle: job.handle,
    options: job.options,
  };
});

export default {
  cronQueues,
  add: <
    K extends keyof RuntimeJobs,
    V extends Parameters<RuntimeJobs[K]['handle']>[0]['data'],
  >(
    name: K,
    data: V,
  ) => {
    console.log(name)
    const queue = cronQueues.find((queue) => queue.name === name);
    return queue?.bull.add(data, queue.options);
  },

  processCronJobs: () => {
    cronQueues.forEach((queue) => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job: any, err) => {
        console.log('Cron job falhou', queue.name, job.data);
        console.log(err);
      });
    });
  },
};
