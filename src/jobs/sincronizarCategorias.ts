import { getApiDatabaseConnection } from '../config/db/database';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import { atualizarCategorias } from '../functions/categorias/atualizarCategorias';
import { cadastrarCategorias } from '../functions/categorias/cadastrarCategorias';
import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import logger from '../utils/logger';
import { tratarTokens } from '../utils/tratarTokens';

export async function SincronizarCategorias() {

    try {
        const apiConexao = await getApiDatabaseConnection();
        const lojas = await getLojasDadosTray(apiConexao);

        for (const loja of lojas) {
            let conexao: any;

            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO);
                conexao = await getLojaDatabaseConnection(dadosConexao);
                const accessToken = await tratarTokens(loja, apiConexao);

                await atualizarCategorias(loja, conexao, accessToken);
                await cadastrarCategorias(loja, conexao, accessToken);
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro na sincronização de categorias da loja ${loja.LTR_CNPJ} -> ${error}`,
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
            message: `Erro na sincronização de categorias -> ${error}`,
        });
    }
}