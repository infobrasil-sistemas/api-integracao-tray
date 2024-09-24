
import { getLojaDatabaseConnection } from "../config/db/lojaDatabase";
import { atualizarEstoques } from "../functions/produtos/atualizarEstoques";
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
            let conexao: any;

            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO)
                conexao = await getLojaDatabaseConnection(dadosConexao);

                await atualizarEstoques(loja, conexao)
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro ao executar rotina de sincronização de estoques para a loja ${loja.LTR_CNPJ} -> ${error}`
                });
            } finally {
                if (conexao) {
                    conexao.detach();
                }
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