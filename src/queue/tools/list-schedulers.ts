// src/tools/list-schedulers.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis';

(async () => {
  const q = new Queue('jobQueue', { connection: redisConfig });
  const scheds = await q.getJobSchedulers(0, 1000, true);
  console.log('TOTAL:', scheds.length);
  for (const s of scheds) {
    console.log({
      id: s.id,
      key: s.key,
      next: s.next && new Date(s.next).toISOString(),
    });
  }
  await q.close();
})();
