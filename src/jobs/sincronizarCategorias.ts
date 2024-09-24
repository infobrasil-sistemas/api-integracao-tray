import { getLojaDatabaseConnection } from "../config/db/lojaDatabase";
import { atualizarCategorias } from "../functions/categorias/atualizarCategorias";
import { cadastrarCategorias } from "../functions/categorias/cadastrarCategorias";
import { getLojaDbConfig } from "../services/lojas/consultas/getLojaDbConfig";
import { getLojasDadosTray } from "../services/lojas/consultas/getLojasDadosTray";
import logger from "../utils/logger";


export async function sincronizarCategorias() {
    logger.log({
        level: 'info',
        message: `Sincronizando categorias...`
    });

    try {
        const lojas = await getLojasDadosTray()
        for (const loja of lojas) {
            let conexao: any;

            try {
                const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO)
                conexao = await getLojaDatabaseConnection(dadosConexao);

                await atualizarCategorias(loja, conexao)
                await cadastrarCategorias(loja, conexao)
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro ao executar rotina de sincronização de categorias para a loja ${loja.LTR_CNPJ} -> ${error}`
                });
            } finally {
                if (conexao) {
                    conexao.detach();
                }
            }
        }
        logger.log({
            level: 'info',
            message: `Categorias sincronizadas com sucesso.`
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao executar rotina de sincronização de categorias -> ${error}`
        });
    }
}