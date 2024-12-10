import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoIntegrado } from '../../interfaces';

export async function atualizarProduto(loja: ILojaTray, accessToken: string, produto: IProdutoIntegrado) {
    try {
        const startPromotionDate = produto.start_promotion || null;
        const endPromotionDate = produto.end_promotion || null;

        const requestBody = {
            Product: {
                ...produto,
                start_promotion: startPromotionDate,
                end_promotion: endPromotionDate
            }
        };
        await axios.put(`${loja.LTR_API_HOST}/products/${produto.id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}