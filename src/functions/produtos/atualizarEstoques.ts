
import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getEstoqueProdutos } from "../../services/produtos/consultas/getEstoqueProdutos";
import { atualizarEstoque } from "../../services/produtos/tray/envios/atualizarEstoque";
import logger from "../../utils/logger";
import { tratarTokens } from "../../utils/tratarTokens";


export async function atualizarEstoques(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    try {
        const estoquesProdutos = await getEstoqueProdutos(loja, dadosConexao)
        if (estoquesProdutos.length > 0) {
            const access_token = await tratarTokens(loja)
            for (const estoqueProduto of estoquesProdutos) {
                await atualizarEstoque(loja, access_token, estoqueProduto)
            }
        }
        else {
            logger.log({
                level: 'info',
                message: `Nenhum produto integrado na loja ${loja.LTR_CNPJ}`
            });
        }

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro na rotina atualizar estoques da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}