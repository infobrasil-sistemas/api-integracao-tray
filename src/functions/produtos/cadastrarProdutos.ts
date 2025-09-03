import { ILojaTray } from "../../interfaces/ILojaTray";
import { getProdutosNaoIntegrados } from "../../services/produtos/banco/getProdutosNaoIntegrados";
import { getVariacoesProduto } from "../../services/produtos/banco/getVariacoesProdutoNaoIntegrada";
import { cadastrarProduto } from "../../services/produtos/tray/envios/cadastrarProduto";
import { cadastrarVariacao } from "../../services/produtos/tray/envios/cadastrarVariacao";
import logger from "../../utils/logger";
import { transformarEmProdutoVariacaoNaoIntegrado } from "../../utils/produtos/transformarEmProdutoVariacaoNaoIntegrado";

export async function cadastrarProdutos(loja: ILojaTray, conexao: any, access_token: string) {
    try {
        const produtosNaoIntegrados = await getProdutosNaoIntegrados(loja, conexao)
        if (produtosNaoIntegrados.length > 0) {
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
                            message: `${error}`
                        });
                    }

                }
            }
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro na rotina cadastrar produtos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}
