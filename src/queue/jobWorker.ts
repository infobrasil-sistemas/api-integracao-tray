import { Worker } from 'bullmq';
import { redisConfig } from '../config/redis';
import { JobData } from './queue';
import logger from '../utils/logger';
import { SincronizarPedidos } from '../jobs/sincronizarPedidos';
import { SincronizarCategorias } from '../jobs/sincronizarCategorias';
import { SincronizarEstoques } from '../jobs/sincronizarEstoques';
import { SincronizarProdutos } from '../jobs/sincronizarProdutos';

export const jobWorker = new Worker<JobData>(
    'jobQueue',
    async (job) => {
        const { jobType, payload } = job.data;
        switch (jobType) {
            case 'categorias':
                await SincronizarCategorias()
                break;
            case 'estoques':
                await SincronizarEstoques()
                break;
            case 'produtos':
                await SincronizarProdutos()
                break;
            default:
                throw new Error(`Job não encontrado: ${jobType}`);
        }
    },
    {
        connection: redisConfig,
        concurrency: 1, // Apenas um job por vez
        removeOnComplete: { age: 60, count: 100 }, // Remove jobs após 60s ou manter no máximo 1000 registros
        removeOnFail: { age: 60, count: 100 }, // Remove falhas após 60s ou manter no máximo 100 registros
        lockDuration: 60000,
        stalledInterval: 120000, // Nunca reprocessa jobs travados
    }
);

jobWorker.on('active', (job) => {
    logger.log({
        level: 'info',
        message: `sincronizando ${job.data.jobType}...`,
    });
});

jobWorker.on('completed', (job) => {
    logger.log({
        level: 'info',
        message: `${job.data.jobType} sincronizados com sucesso.`,
    });
});

jobWorker.on('failed', (job, err) => {
    logger.log({
        level: 'error',
        message: `Sincronizador de ${job?.data.jobType} falhou -> ${err}`,
    });
});
