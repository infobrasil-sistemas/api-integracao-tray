import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoIntegrado } from '../../interfaces';

export async function getProduto(loja: ILojaTray, accessToken: string, id: number): Promise<IProdutoIntegrado> {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/products/${id}`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            const produto = response.data.Product;

            const {
                id,
                ean,
                name,
                ncm,
                description,
                description_small,
                price,
                cost_price,
                //promotional_price,
                //start_promotion,
                //end_promotion,
                brand,
                weight,
                length,
                width,
                height,
                category_id,
                available,
                reference
            } = produto;


            return {
                id: parseInt(id),
                ean,
                name,
                ncm,
                description,
                description_small,
                price: parseFloat(price),
                cost_price: parseFloat(cost_price),
                //promotional_price: promotional_price ? parseFloat(promotional_price) : null,
                //start_promotion,
                //end_promotion,
                brand,
                weight: parseFloat(weight),
                length: parseFloat(length),
                width: parseFloat(width),
                height: parseFloat(height),
                category_id: parseInt(category_id),
                available: parseInt(available),
                reference
            };
        } else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar produto ${id} da loja ${loja.LTR_CNPJ} -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar produto ${id} da loja ${loja.LTR_CNPJ} -> ${response.data.message}`);
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY`
        });
        throw new Error(`Erro de conexão com API da TRAY`);
    }
}
