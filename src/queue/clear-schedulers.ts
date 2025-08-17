// src/tools/clear-schedulers.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis';
import { jobQueue } from './queue';

async function run() {
    const q = new Queue('jobQueue', { connection: redisConfig });

    // 1) Remover TODOS os Job Schedulers (API nova)
    const scheds = await q.getJobSchedulers(0, 1000, true);
    console.log(`Encontrados ${scheds.length} job schedulers...`);
    for (const s of scheds) {
        if (s.id) { // só entra se for string válida
            console.log(`Removendo scheduler id=${s.id}`);
            await jobQueue.removeJobScheduler(s.id);
        }
    }

    // 2) (Opcional) Remover repeatables antigos (API antiga—ainda funciona no v5)
    // Use APENAS se você já usou repeatables no passado
    const repeatables = await (q as any).getRepeatableJobs?.();
    if (repeatables?.length) {
        console.log(`Encontrados ${repeatables.length} repeatable jobs (legado)...`);
        for (const r of repeatables) {
            console.log(`Removendo repeatable key=${r.key}`);
            await (q as any).removeRepeatableByKey?.(r.key);
        }
    }

    await q.close();
    console.log('Limpeza concluída.');
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});
