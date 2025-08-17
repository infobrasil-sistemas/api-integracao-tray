// src/tools/drain-queue.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis';
(async () => {
  const q = new Queue('jobQueue', { connection: redisConfig });
  await q.drain(true); // true = também remove delayed
  await q.close();
  console.log('Queue drained (waiting+delayed).');
})();
