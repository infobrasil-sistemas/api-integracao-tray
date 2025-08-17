// src/tools/queue-stats.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis';

(async () => {
  const q = new Queue('jobQueue', { connection: redisConfig });

  const counts = await q.getJobCounts('waiting','delayed','active','paused','completed','failed');
  console.log('COUNTS:', counts);

  const waiting = await q.getJobs(['waiting'], 0, 200, true);
  console.log('WAITING sample:',
    waiting.slice(0,20).map(j => ({ id: j.id, name: j.name, jobType: j.data?.jobType }))
  );

  const delayed = await q.getJobs(['delayed'], 0, 200, true);
  console.log('DELAYED sample:',
    delayed.slice(0,20).map(j => ({ id: j.id, name: j.name, jobType: j.data?.jobType }))
  );

  await q.close();
})();
