import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getProdutosNaoIntegrados } from "../../services/produtos/consultas/getProdutosNaoIntegrados";
import { getVariacoesProduto } from "../../services/produtos/consultas/getVariacoesProdutoNaoIntegrada";
import { cadastrarProduto } from "../../services/produtos/tray/envios/cadastrarProduto";
import { cadastrarVariacao } from "../../services/produtos/tray/envios/cadastrarVariacao";
import logger from "../../utils/logger";
import { transformarEmProdutoVariacaoNaoIntegrado } from "../../utils/produtos/transformarEmProdutoVariacaoNaoIntegrado";
import { tratarTokens } from "../../utils/tratarTokens";

export async function cadastrarProdutos(loja: ILojaTray, conexao: any) {
    try {
        const produtosNaoIntegrados = await getProdutosNaoIntegrados(loja, conexao)
        if (produtosNaoIntegrados.length > 0) {
            const access_token = await tratarTokens(loja)
            for (const produtoNaoIntegrado of produtosNaoIntegrados) {
                const product_id = await cadastrarProduto(loja, conexao, access_token, produtoNaoIntegrado)
                if (product_id) {
                    try {
                        const variacoes = await getVariacoesProduto(loja, conexao, product_id)
                        if (variacoes.length > 0) {
                            for (const variacao of variacoes) {
                                const produtoVariacaoNaoIntegrado = transformarEmProdutoVariacaoNaoIntegrado(produtoNaoIntegrado, variacao)
                                await cadastrarVariacao(loja, conexao, access_token, produtoVariacaoNaoIntegrado)
                            }
                        }
                    } catch (error) {
                        logger.log({
                            level: 'error',
                            message: `Erro ao buscar variações do produto ${produtoNaoIntegrado.name} da loja ${loja.LTR_CNPJ} -> ${error}`
                        });
                    }

                }
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
