import { Job } from 'bull';
import { MyJobs } from '.';
import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import logger from '../utils/logger';
import { cadastrarPedidos } from '../functions/pedidos/cadastrarPedidos';
import { getApiDatabaseConnection } from '../config/db/database';
import { tratarTokens } from '../utils/tratarTokens';

export const SincronizarPedidos: MyJobs<null> = {
  key: 'SincronizarPedidos',
  options: {
    repeat: { cron: '*/5 * * * *' },
  },
  handle: async (job: Job<null>) => {
    logger.log({
      level: 'info',
      message: `Sincronizando pedidos...`,
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

          await cadastrarPedidos(loja, conexao, accessToken);
        } catch (error) {
          logger.log({
            level: 'error',
            message: `Erro ao executar rotina de sincronização de pedidos para a loja ${loja.LTR_CNPJ} -> ${error}`,
          });
        } finally {
          if (conexao) {
            conexao.detach();
          }
        }
      }

      logger.log({
        level: 'info',
        message: `Pedidos sincronizados com sucesso.`,
      });
    } catch (error) {
      logger.log({
        level: 'error',
        message: `Erro ao executar rotina de sincronização de pedidos -> ${error}`,
      });
    }
  },
};
