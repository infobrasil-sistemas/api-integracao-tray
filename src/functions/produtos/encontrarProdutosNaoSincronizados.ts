import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getGruposNaoIntegrados } from "../../services/categorias/consultas/getGruposNaoIntegrados";
import { enviarGrupo } from "../../services/categorias/tray/envios/enviarGrupo";
import { encontrarRelacaoProduto } from "../../services/produtos/banco/encontrarRelacaoProduto";
import { ressincronizarProduto } from "../../services/produtos/banco/ressincronizarProduto";
import { getAllProducts } from "../../services/produtos/tray/consultas/getAllProducts";
import logger from "../../utils/logger";


export async function encontrarProdutosNaoSincronizados(loja: ILojaTray, conexao: IConnectionOptions, accessToken: string) {
    try {
        const produtos = await getAllProducts(loja, accessToken)
        logger.log({
            level: 'info',
            message: `Total produtos da loja ${loja.LTR_CNPJ}: ${produtos.length}.`
        });
        const produtosNaoSincronizados: number[] = []
        for (const produto of produtos) {
            const pro_codigo: string | null = await encontrarRelacaoProduto(loja, conexao, produto.id)
            if (!pro_codigo) {
                produtosNaoSincronizados.push(produto.id)
            }
        }
        logger.log({
            level: 'info',
            message: `Produtos não sincronizados da loja ${loja.LTR_CNPJ}:${produtosNaoSincronizados} .`
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao encontrar produtos nao sincronizados da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}


