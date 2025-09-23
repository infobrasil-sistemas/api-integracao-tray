import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { getGruposNaoIntegrados } from "../../services/categorias/consultas/getGruposNaoIntegrados";
import { enviarGrupo } from "../../services/categorias/tray/envios/enviarGrupo";
import { ressincronizarProduto } from "../../services/produtos/banco/ressincronizarProduto";
import { getAllProducts } from "../../services/produtos/tray/consultas/getAllProducts";
import logger from "../../utils/logger";


export async function ressincronizarProdutos(loja: ILojaTray, conexao: IConnectionOptions, accessToken: string) {
    try {
        const produtos = await getAllProducts(loja, accessToken)
        logger.log({
            level: 'info',
            message: `Total produtos da loja ${loja.LTR_CNPJ}: ${produtos.length}.`
        });
        let totalProdutosRessincronizados = 0
        // for (const produto of produtos) {
        //     const pro_codigo: string | null = await ressincronizarProduto(loja, conexao, produto)
        //     if (pro_codigo) {
        //         logger.log({
        //             level: 'info',
        //             message: `Produto ${produto.id} ressincronizado com o produto ${pro_codigo} na infobrasil`
        //         });
        //         totalProdutosRessincronizados++
        //     } else {
        //         logger.log({
        //             level: 'info',
        //             message: `Produto ${produto.id} já está sincronizado.`
        //         });
        //     }
        // }
        // logger.log({
        //     level: 'info',
        //     message: `Total produtos ressincronizados da loja ${loja.LTR_CNPJ}: ${totalProdutosRessincronizados}.`
        // });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao ressincronizar produtos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}


