import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoVariacaoIntegrado } from '../../interfaces';

export async function getVariacao(loja: ILojaTray, accessToken: string, id: number): Promise<IProdutoVariacaoIntegrado> {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/products/variants/${id}`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            const variacao = response.data.Variant;

            const {
                id,
                ean,
                price,
                cost_price,
                reference,
                weight,
                length,
                width,
                height,
                //start_promotion,
                //end_promotion,
                //promotional_price,
                Sku
            } = variacao;


            return {
                id: parseInt(id),
                ean,
                //price: parseFloat(price),
                cost_price: parseFloat(cost_price),
                reference,
                weight: parseFloat(weight),
                length: parseFloat(length),
                width: parseFloat(width),
                height: parseFloat(height),
                //start_promotion,
                //end_promotion,
                //promotional_price: promotional_price ? parseFloat(promotional_price) : null,
                value_1: Sku[0].value,
                value_2: Sku[1].value
            };
        } else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar variação ${id} da loja ${loja.LTR_NOME} -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar variação ${id} da loja ${loja.LTR_NOME} -> ${response.data.message}`);
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY`
        });
        throw new Error(`Erro de conexão com API da TRAY`);
    }
}
