import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IEstoqueProduto } from '../../interfaces';
import { isToday } from '../../../../utils/isToday';
import { dessincronizarProdutoExcluido } from '../../banco/dessincronizarProdutoExcluido';

export async function atualizarEstoque(loja: ILojaTray, conexao: any, accessToken: string, estoque: IEstoqueProduto) {
    try {
        let promotional_price = undefined
        let start_promotion = undefined
        let end_promotion = undefined
        if (estoque.start_promotion && estoque.end_promotion && loja.LTR_SINCRONIZA_PROMOCOES == "S") {
            promotional_price = estoque.price - estoque.desconto
            start_promotion = estoque.start_promotion
            end_promotion = estoque.end_promotion
        }
        const estoqueMinimoLoja = Math.trunc(loja.LTR_ESTOQUE_MINIMO)
        const estoqueProduto = Math.trunc(estoque.stock)
        const requestBody = {
            Product: {
                ...estoque,
                pro_codigo: undefined,
                desconto: undefined,
                stock: estoqueMinimoLoja > estoqueProduto ? 0 : (estoqueProduto - estoqueMinimoLoja),
                promotional_price: promotional_price,
                start_promotion: start_promotion,
                end_promotion: end_promotion
            }
        };

        await axios.put(`${loja.LTR_API_HOST}/products/${estoque.id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
            // if (estoque.name === undefined) {
            //     await dessincronizarProdutoExcluido(loja, conexao, estoque.pro_codigo)
            //     logger.log({
            //         level: 'info',
            //         message: `Produto excluido ${estoque.pro_codigo} da loja ${loja.LTR_CNPJ} dessincronizado com sucesso.`
            //     });
            // }
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}