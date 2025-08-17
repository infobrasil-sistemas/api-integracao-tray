// src/tools/clear-waiting-all.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../../config/redis';

const TYPES = new Set(['estoques','produtos','categorias','pedidos']);

async function removeRange(q: Queue, states: ('waiting'|'delayed')[]) {
  let removed = 0;
  for (const state of states) {
    let start = 0, step = 1000;
    while (true) {
      const jobs = await q.getJobs([state], start, start + step - 1, true);
      if (!jobs.length) break;
      for (const j of jobs) {
        const t = j.data?.jobType ?? j.name;
        if (TYPES.has(t)) {
          await j.remove();
          removed++;
        }
      }
      if (jobs.length < step) break;
      start += step;
    }
  }
  return removed;
}

(async () => {
  const q = new Queue('jobQueue', { connection: redisConfig });
  const removed = await removeRange(q, ['waiting','delayed']);
  console.log(`Removidos ${removed} jobs (waiting/delayed) de tipos ${[...TYPES].join(', ')}`);
  await q.close();
})();
