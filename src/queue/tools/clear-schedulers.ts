// src/tools/clear-schedulers.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis';

(async () => {
  const q = new Queue('jobQueue', { connection: redisConfig });
  const scheds = await q.getJobSchedulers(0, 5000, true);
  console.log(`Removendo ${scheds.length} schedulers...`);
  for (const s of scheds) {
    if (s.id) await q.removeJobScheduler(s.id);
  }
  await q.close();
  console.log('OK.');
})();
