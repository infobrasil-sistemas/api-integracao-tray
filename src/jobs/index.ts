import { Job, JobOptions } from 'bull'
export { SincronizarCategorias } from './SincronizarCategorias';
export { SincronizarEstoques } from './SincronizarEstoques';
export { SincronizarPedidos } from './SincronizarPedidos';
export { SincronizarProdutos } from './SincronizarProdutos';

export type MyJobs<T> = {
    key: string;
    options: JobOptions;
    handle: (job: Job<T>) => Promise<void>;
};