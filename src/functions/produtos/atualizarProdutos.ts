
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getProdutosIntegrados } from "../../services/produtos/consultas/getProdutosIntegrados";
import { getVariacoesProdutoIntegradas } from "../../services/produtos/consultas/getVariacoesProdutoIntegradas";
import { atualizarProduto } from "../../services/produtos/tray/envios/atualizarProduto";
import { atualizarVariacao } from "../../services/produtos/tray/envios/atualizarVariacao";
import logger from "../../utils/logger";
import { transformarEmProdutoVariacaoIntegrado } from "../../utils/produtos/transformarEmProdutoVariacaoIntegrado";


export async function atualizarProdutos(loja: ILojaTray, conexao: any, access_token: string) {
    try {
        const produtosIntegrados = await getProdutosIntegrados(loja, conexao)
        if (produtosIntegrados.length > 0) {
            for (const produtoIntegrado of produtosIntegrados) {
                await atualizarProduto(loja, access_token, produtoIntegrado)
                try {
                    const variacoes = await getVariacoesProdutoIntegradas(loja, conexao, produtoIntegrado.id)
                    if (variacoes.length > 0) {
                        for (const variacao of variacoes) {
                            const produtoVariacaoIntegrado = transformarEmProdutoVariacaoIntegrado(produtoIntegrado, variacao)
                            await atualizarVariacao(loja, access_token, produtoVariacaoIntegrado)
                        }
                    }
                } catch (error) {
                    logger.log({
                        level: 'error',
                        message: `Erro ao atualizar variações do produto ${produtoIntegrado.name} da loja ${loja.LTR_CNPJ} -> ${error}`
                    });
                }
            }
        }
    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro na rotina atualizar produtos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}