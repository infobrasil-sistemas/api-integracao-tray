import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoVariacaoIntegrado } from '../../interfaces';

export async function atualizarVariacao(loja: ILojaTray, accessToken: string, variacao: IProdutoVariacaoIntegrado) {
    try {

        const startPromotionDate = variacao.start_promotion || null;
        const endPromotionDate = variacao.end_promotion || null;

        const requestBody = {
            Variant: {
                ...variacao,
                start_promotion: startPromotionDate,
                end_promotion: endPromotionDate
            }
        };

        await axios.put(`${loja.LTR_API_HOST}/products/variants/${variacao.id}?access_token=${accessToken}`, requestBody);
    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar variação ${variacao.ean} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}