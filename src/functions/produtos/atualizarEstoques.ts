import { ILojaTray } from "../../interfaces/ILojaTray";
import { getEstoqueProdutos } from "../../services/produtos/consultas/getEstoqueProdutos";
import { getEstoqueProdutosComVariacao } from "../../services/produtos/consultas/getEstoqueProdutosComVariacoes";
import { getProdutosComVariacoes } from "../../services/produtos/consultas/getProdutosComVariacoes";
import { atualizarEstoque } from "../../services/produtos/tray/envios/atualizarEstoque";
import { atualizarEstoqueVariacao } from "../../services/produtos/tray/envios/atualizarEstoqueVariacao";
import logger from "../../utils/logger";


export async function atualizarEstoques(loja: ILojaTray, conexao: any, access_token: string) {
    try {
        const objProdutosComVariacao = await getProdutosComVariacoes(loja, conexao);
        const idsProdutosComVariacao = new Set(objProdutosComVariacao.map((produto: any) => produto.id));
        const estoquesProdutos = await getEstoqueProdutos(loja, conexao);
        const estoqueProdutosSemVariacao = estoquesProdutos.filter(produto => !idsProdutosComVariacao.has(produto.id));
        const estoqueProdutosComVariacao = await getEstoqueProdutosComVariacao(loja, conexao, Array.from(idsProdutosComVariacao));
        if (estoqueProdutosSemVariacao.length > 0) {
            for (const estoqueProdutoSemVariacao of estoqueProdutosSemVariacao) {
                await atualizarEstoque(loja, access_token, estoqueProdutoSemVariacao)
            }
        }
        if (estoqueProdutosComVariacao.length > 0) {
            for (const estoqueProdutoComVariacao of estoqueProdutosComVariacao) {
                await atualizarEstoqueVariacao(loja, access_token, estoqueProdutoComVariacao)
            }
        }

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro na rotina atualizar estoques da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}
