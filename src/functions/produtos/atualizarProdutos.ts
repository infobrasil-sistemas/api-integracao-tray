
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getProdutosIntegrados } from "../../services/produtos/consultas/getProdutosIntegrados";
import { getVariacoesProdutoIntegradas } from "../../services/produtos/consultas/getVariacoesProdutoIntegradas";
import { getProduto } from "../../services/produtos/tray/consultas/getProduto";
import { getVariacao } from "../../services/produtos/tray/consultas/getVariacao";
import { atualizarProduto } from "../../services/produtos/tray/envios/atualizarProduto";
import { atualizarVariacao } from "../../services/produtos/tray/envios/atualizarVariacao";
import logger from "../../utils/logger";
import { transformarEmProdutoVariacaoIntegrado } from "../../utils/produtos/transformarEmProdutoVariacaoIntegrado";
import { tratarTokens } from "../../utils/tratarTokens";
import isEqual from 'lodash/isEqual';


export async function atualizarProdutos(loja: ILojaTray, conexao: any) {
    try {
        const produtosIntegrados = await getProdutosIntegrados(loja, conexao)
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
                try {
                    const variacoes = await getVariacoesProdutoIntegradas(loja, conexao, produtoIntegrado.id)
                    if (variacoes.length > 0) {
                        for (const variacao of variacoes) {
                            const produtoVariacaoIntegrado = transformarEmProdutoVariacaoIntegrado(produtoIntegrado, variacao)
                            const variacaoTray = await getVariacao(loja, access_token, variacao.id)
                            if (!isEqual(produtoVariacaoIntegrado, variacaoTray)) {
                                await atualizarVariacao(loja, access_token, produtoVariacaoIntegrado)
                            }
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