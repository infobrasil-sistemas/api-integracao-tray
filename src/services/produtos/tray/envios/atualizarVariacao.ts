import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoVariacaoIntegrado } from '../../interfaces';
import dayjs from 'dayjs';

export async function atualizarVariacao(loja: ILojaTray, accessToken: string, variacao: IProdutoVariacaoIntegrado) {
    try {

        const startPromotionDate = variacao.start_promotion ? dayjs(variacao.start_promotion).toDate() : null;
        const endPromotionDate = variacao.end_promotion ? dayjs(variacao.end_promotion).toDate() : null;

        const requestBody = {
            Variant: {
                ...variacao,
                start_promotion: startPromotionDate,
                end_promotion: endPromotionDate
            }
        };

        const response = await axios.put(`${loja.LTR_API_HOST}/products/variants/${variacao.id}?access_token=${accessToken}`, requestBody);
        if (response.status === 201 || response.status === 200) {
            logger.log({
                level: 'info',
                message: `Variação ${variacao.ean} da loja ${loja.LTR_CNPJ} atualizada com sucesso.`
            });
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar variação ${variacao.ean} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar variação ${variacao.ean} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}