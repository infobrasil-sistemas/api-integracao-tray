import 'dotenv/config';
import { jobsQueue, jobs } from './queue/jobsQueue';


console.log('Worker iniciado. Aguardando rotinas...');
// Processa cada job com concorrência de 1 (um de cada vez)
jobsQueue.process(1, async (job) => {
    console.log("processando job")
    const jobConfig = jobs[job.name as keyof typeof jobs];
    if (jobConfig) {
        await jobConfig.handler();
    } else {
        console.error(`Nenhuma rotina configurada para o nome: ${job.name}`);
    }
});

jobsQueue.on('completed', (job) => {
    console.log(`Job '${job.name}' concluído com sucesso.`);
});

jobsQueue.on('failed', (job, error) => {
    console.error(`Job '${job.name}' falhou com erro:`, error);
});


