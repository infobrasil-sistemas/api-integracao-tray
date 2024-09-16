import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getLojaDbConfig } from "../../services/lojas/consultas/getLojaDbConfig";
import { getProdutosNaoIntegrados } from "../../services/produtos/consultas/getProdutosNaoIntegrados";
import { cadastrarProduto } from "../../services/produtos/tray/envios/cadastrarProduto";
import logger from "../../utils/logger";
import { tratarTokens } from "../../utils/tratarTokens";

export async function cadastrarProdutos(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    try {
        const produtosNaoIntegrados = await getProdutosNaoIntegrados(loja, dadosConexao)
        if (produtosNaoIntegrados.length > 0) {
            const access_token = await tratarTokens(loja)
            for (const produtoNaoIntegrado of produtosNaoIntegrados) {
                await cadastrarProduto(loja, dadosConexao, access_token, produtoNaoIntegrado)
            }
        }
        else {
            logger.log({
                level: 'info',
                message: `Nenhum produto novo para a loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro na rotina cadastrar produtos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}
