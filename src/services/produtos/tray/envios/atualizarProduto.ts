import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoIntegrado, IProdutoNaoIntegrado } from '../../interfaces';
import dayjs from 'dayjs';

export async function atualizarProduto(loja: ILojaTray, accessToken: string, produto: IProdutoIntegrado) {
    try {

        const startPromotionDate = produto.start_promotion ? dayjs(produto.start_promotion).toDate() : null;
        const endPromotionDate = produto.end_promotion ? dayjs(produto.end_promotion).toDate() : null;
        
        const requestBody = {
            Product: {
                ...produto,
                start_promotion: startPromotionDate,
                end_promotion: endPromotionDate
            }
        };

        const response = await axios.put(`${loja.LTR_API_HOST}/products/${produto.id}?access_token=${accessToken}`, requestBody);
        if (response.status === 201 || response.status === 200) {
            logger.log({
                level: 'info',
                message: `Produto ${produto.ean} da loja ${loja.LTR_CNPJ} atualizado com sucesso.`
            });
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar produto ${produto.ean} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}