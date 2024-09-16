
import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getProdutosIntegrados } from "../../services/produtos/consultas/getProdutosIntegrados";
import { getProduto } from "../../services/produtos/tray/consultas/getProduto";
import { atualizarProduto } from "../../services/produtos/tray/envios/atualizarProduto";
import logger from "../../utils/logger";
import { tratarTokens } from "../../utils/tratarTokens";
import isEqual from 'lodash/isEqual';


export async function atualizarProdutos(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    try {
        const produtosIntegrados = await getProdutosIntegrados(loja, dadosConexao)
        if (produtosIntegrados.length > 0) {
            const access_token = await tratarTokens(loja)
            for (const produtoIntegrado of produtosIntegrados) {
                try {
                    const produtoTray = await getProduto(loja, access_token, produtoIntegrado.id)
                    if (!isEqual(produtoIntegrado, produtoTray)) {
                        await atualizarProduto(loja, access_token, produtoIntegrado)
                    }
                } catch (error) {
                    logger.log({
                        level: 'error',
                        message: `Erro ao atualizar o produto ${produtoIntegrado.name} da loja ${loja.LTR_CNPJ} -> ${error}`
                    });
                }
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
            message: `Erro na rotina atualizar produtos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}