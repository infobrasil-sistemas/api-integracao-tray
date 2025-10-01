import { ILojaTray } from "../../interfaces/ILojaTray";
import { getEstoqueProdutosSemVariacao } from "../../services/produtos/banco/getEstoqueProdutosSemVariacao";
import { getEstoqueProdutosComVariacao } from "../../services/produtos/banco/getEstoqueProdutosComVariacoes";
import { atualizarEstoque } from "../../services/produtos/tray/envios/atualizarEstoque";
import { atualizarEstoqueVariacao } from "../../services/produtos/tray/envios/atualizarEstoqueVariacao";
import logger from "../../utils/logger";
import { IEstoqueProduto } from "../../services/produtos/interfaces";


export async function atualizarEstoques(loja: ILojaTray, conexao: any, access_token: string) {
    try {
        const estoqueProdutosComVariacao = await getEstoqueProdutosComVariacao(loja, conexao);
        const idsProdutosComVariacao = new Set(estoqueProdutosComVariacao.map((produto: IEstoqueProduto) => produto.reference));
        const estoqueProdutosSemVariacao = await getEstoqueProdutosSemVariacao(loja, conexao, Array.from(idsProdutosComVariacao));
        if (estoqueProdutosSemVariacao.length > 0) {
            for (const estoqueProdutoSemVariacao of estoqueProdutosSemVariacao) {
                await atualizarEstoque(loja, conexao, access_token, estoqueProdutoSemVariacao)
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
