// src/scheduler.ts
import logger from './utils/logger';
import { upsertSchedulers } from './queue/scheduler';

(async () => {
  try {
    await upsertSchedulers();
    logger.info('Schedulers prontos. Saindo...');
    process.exit(0);
  } catch (e: any) {
    logger.error(`Falha ao criar schedulers: ${e?.message ?? e}`);
    process.exit(1);
  }
})();
