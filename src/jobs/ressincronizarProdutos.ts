import { getApiDatabaseConnection } from '../config/db/database';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import { encontrarProdutosNaoSincronizados } from '../functions/produtos/encontrarProdutosNaoSincronizados';
import { ressincronizarProdutos } from '../functions/produtos/ressincronizarProdutos';
import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import logger from '../utils/logger';
import { tratarTokens } from '../utils/tratarTokens';

export async function RessincronizarProdutos() {
    let apiConexao;
    try {
        apiConexao = await getApiDatabaseConnection();
        const lojas = await getLojasDadosTray(apiConexao);

        for (const loja of lojas) {
            let conexao: any;

            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO);
                conexao = await getLojaDatabaseConnection(dadosConexao);
                const accessToken = await tratarTokens(loja, apiConexao);

                await encontrarProdutosNaoSincronizados(loja, conexao, accessToken);
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro na ressincronização de produtos da loja ${loja.LTR_NOME} -> ${error}`,
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
    } finally {
        if (apiConexao) {
            apiConexao.detach();
        }
    }

}