import { atualizarProdutos } from '../functions/produtos/atualizarProdutos';
import { cadastrarProdutos } from '../functions/produtos/cadastrarProdutos';
import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import logger from '../utils/logger';
import { getApiDatabaseConnection } from '../config/db/database';
import { tratarTokens } from '../utils/tratarTokens';


export async function SincronizarProdutos() {
    let apiConexao
    try {
        apiConexao = await getApiDatabaseConnection();
        const lojas = await getLojasDadosTray(apiConexao);
        for (const loja of lojas) {
            let conexao: any;

            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO);
                conexao = await getLojaDatabaseConnection(dadosConexao);
                const accessToken = await tratarTokens(loja, apiConexao);

                if(loja.LTR_SINCRONIZA_ALTERACOES === 'S'){
                    await atualizarProdutos(loja, conexao, accessToken);
                }
                await cadastrarProdutos(loja, conexao, accessToken);
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro na sincronização de produtos da loja ${loja.LTR_NOME} -> ${error}`,
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
            message: `Erro na sincronização de produtos -> ${error}`,
        });
    } finally {
        if (apiConexao) {
            apiConexao.detach();
        }
    }
}