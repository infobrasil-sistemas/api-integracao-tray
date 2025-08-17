// src/queue/queue.ts
import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis';

export type JobType = 'categorias' | 'produtos' | 'estoques' | 'pedidos';

export interface JobData {
  jobType: JobType;
  payload: any;
  priority?: number;
}

export const jobQueue = new Queue<JobData>('jobQueue', {
  connection: redisConfig,
});
