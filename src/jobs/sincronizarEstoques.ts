import { Job } from 'bull';
import { MyJobs } from '.';
import { getApiDatabaseConnection } from '../config/db/database';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import { atualizarEstoques } from '../functions/produtos/atualizarEstoques';
import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import logger from '../utils/logger';
import { tratarTokens } from '../utils/tratarTokens';

export const SincronizarEstoques: MyJobs<null> = {
  key: 'SincronizarEstoques',
  options: {
    repeat: { cron: '*/5 * * * *' }, 
  },
  handle: async (job: Job<null>) => {
    logger.log({
      level: 'info',
      message: `Sincronizando estoques...`,
    });
    try {
      const apiConexao = await getApiDatabaseConnection();
      const lojas = await getLojasDadosTray(apiConexao);

      for (const loja of lojas) {
        let conexao: any;

        try {
          const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO);
          conexao = await getLojaDatabaseConnection(dadosConexao);
          const accessToken = await tratarTokens(loja, apiConexao);

          await atualizarEstoques(loja, conexao, accessToken);
        } catch (error) {
          logger.log({
            level: 'error',
            message: `Erro ao executar rotina de sincronização de estoques para a loja ${loja.LTR_CNPJ} -> ${error}`,
          });
        } finally {
          if (conexao) {
            conexao.detach();
          }
        }
      }

      logger.log({
        level: 'info',
        message: `Estoques sincronizados com sucesso.`,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        message: `Erro ao executar rotina de sincronização de estoques -> ${error}`,
      });
    }
  },
};
