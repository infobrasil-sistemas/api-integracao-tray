import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import logger from '../utils/logger';
import { cadastrarPedidos } from '../functions/pedidos/cadastrarPedidos';
import { getApiDatabaseConnection } from '../config/db/database';
import { tratarTokens } from '../utils/tratarTokens';

export async function SincronizarPedidos() {

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
          message: `Erro na sincronização de pedidos da loja ${loja.LTR_CNPJ} -> ${error}`,
        });
      } finally {
        if (conexao) {
          conexao.detach();
        }
      }
    }

  } catch (error) {
    logger.log({
      level: 'error',
      message: `Erro na sincronização de pedidos -> ${error}`,
    });
  }
}
