
import { atualizarEstoques } from "../functions/produtos/atualizarEstoques";
import { atualizarProdutos } from "../functions/produtos/atualizarProdutos";
import { cadastrarProdutos } from "../functions/produtos/cadastrarProdutos";
import { getLojaDbConfig } from "../services/lojas/consultas/getLojaDbConfig";
import { getLojasDadosTray } from "../services/lojas/consultas/getLojasDadosTray";
import logger from "../utils/logger";

export async function sincronizarEstoques() {
    logger.log({
        level: 'info',
        message: `Sincronizando estoques...`
    });

    try {
        const lojas = await getLojasDadosTray()
        for (const loja of lojas) {
            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO)
                await atualizarEstoques(loja, dadosConexao)
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro ao executar rotina de sincronização de estoques para a loja ${loja.LTR_CNPJ} -> ${error}`
                });
            }
        }
        logger.log({
            level: 'info',
            message: `Estoques sincronizados com sucesso.`
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao executar rotina de sincronização de estoques -> ${error}`
        });
    }
}