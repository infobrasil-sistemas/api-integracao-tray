import { atualizarEstoques } from "../functions/produtos/atualizarEstoques";
import { atualizarProdutos } from "../functions/produtos/atualizarProdutos";
import { cadastrarProdutos } from "../functions/produtos/cadastrarProdutos";
import { getLojaDbConfig } from "../services/lojas/consultas/getLojaDbConfig";
import { getLojasDadosTray } from "../services/lojas/consultas/getLojasDadosTray";
import { getLojaDatabaseConnection } from "../config/db/lojaDatabase";
import logger from "../utils/logger";

export async function sincronizarProdutos() {
    logger.log({
        level: 'info',
        message: `Sincronizando produtos...`
    });

    try {
        const lojas = await getLojasDadosTray();

        for (const loja of lojas) {
            let conexao: any;

            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO);
                conexao = await getLojaDatabaseConnection(dadosConexao);

                await atualizarProdutos(loja, conexao);
                await cadastrarProdutos(loja, conexao);
                await atualizarEstoques(loja, conexao);

            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro ao executar rotina de sincronização de produtos para a loja ${loja.LTR_CNPJ} -> ${error}`
                });
            } finally {
                if (conexao) {
                    conexao.detach();
                }
            }
        }

        logger.log({
            level: 'info',
            message: `Produtos sincronizados com sucesso.`
        });

    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao executar rotina de sincronização de produtos -> ${error}`
        });
    }
}
