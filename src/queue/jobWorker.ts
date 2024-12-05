import { Worker } from 'bullmq';
import { redisConfig } from '../config/redis';
import { JobData } from './queue';
import { SincronizarCategorias } from '../jobs/SincronizarCategorias';
import { SincronizarEstoques } from '../jobs/SincronizarEstoques';
import { SincronizarProdutos } from '../jobs/SincronizarProdutos';
import { SincronizarPedidos } from '../jobs/SincronizarPedidos';
import logger from '../utils/logger';

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
            case 'pedidos':
                await SincronizarPedidos()
                break;

            default:
                throw new Error(`Job não encontrado: ${jobType}`);
        }
    },
    {
        connection: redisConfig,
        concurrency: 1,
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
