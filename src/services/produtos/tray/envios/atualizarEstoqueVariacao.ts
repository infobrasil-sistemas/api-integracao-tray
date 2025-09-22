import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IEstoqueProduto } from '../../interfaces';
import { isToday } from '../../../../utils/isToday';

export async function atualizarEstoqueVariacao(loja: ILojaTray, accessToken: string, estoque: IEstoqueProduto) {
    try {
        let promotional_price = undefined
        let start_promotion = undefined
        let end_promotion = undefined
        if (estoque.start_promotion && estoque.end_promotion && loja.LTR_SINCRONIZA_PROMOCOES === 'S') {
            promotional_price = estoque.price - estoque.desconto
            start_promotion = estoque.start_promotion
            end_promotion = estoque.end_promotion
        }
        const estoqueMinimoLoja = Math.trunc(loja.LTR_ESTOQUE_MINIMO)
        const estoqueProduto = Math.trunc(estoque.stock)
        const requestBody = {
            Variant: {
                ...estoque,
                desconto: undefined,
                pro_codigo: undefined,
                stock: estoqueMinimoLoja > estoqueProduto ? 0 : (estoqueProduto - estoqueMinimoLoja),
                promotional_price: promotional_price,
                start_promotion: start_promotion,
                end_promotion: end_promotion
            }
        };
        await axios.put(`${loja.LTR_API_HOST}/products/variants/${estoque.id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar estoque da variação ${estoque.id} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao atualizar estoque da variação ${estoque.id} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}