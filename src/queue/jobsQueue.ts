import Queue from 'bull';
import { sincronizarProdutos } from '../jobs/sincronizarProdutos';
import { sincronizarEstoques } from '../jobs/sincronizarEstoques';
import { sincronizarCategorias } from '../jobs/sincronizarCategorias';
import { sincronizarPedidos } from '../jobs/sincronizarPedidos';

const jobsQueue = new Queue('jobsQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
});

const jobs: { [key: string]: { handler: () => Promise<any>; priority: number } } = {
    sincronizarEstoques: { handler: sincronizarEstoques, priority: 1 },
    sincronizarPedidos: { handler: sincronizarPedidos, priority: 2 },
    sincronizarProdutos: { handler: sincronizarProdutos, priority: 3 },
    sincronizarCategorias: { handler: sincronizarCategorias, priority: 4 },
};

// Função para adicionar um job com prioridade à fila
export function addJobToQueue(jobName: keyof typeof jobs) {
    const jobConfig = jobs[jobName];
    if (jobConfig) {
        jobsQueue.add(String(jobName), {}, { priority: jobConfig.priority });
    } else {
        console.error(`Rotina '${jobName}' não encontrada.`);
    }
}

export { jobsQueue, jobs };
