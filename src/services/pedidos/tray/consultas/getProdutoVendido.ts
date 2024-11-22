import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProductSold } from '../../../pedidos/interfaces';

export async function getProdutoVendido(loja: ILojaTray, accessToken: string, id: number): Promise<IProductSold> {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/products_solds/${id}`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            const produtoVendido = response.data.ProductsSold;

            const {
                product_id,
                quantity,
                id,
                price,
                variant_id
            } = produtoVendido;

            return {
                product_id: parseInt(product_id),
                quantity: parseInt(quantity),
                id: parseInt(id),
                price: parseFloat(price),
                variant_id: parseInt(variant_id)
            };
        } else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar produto vendido ${id} da loja ${loja.LTR_CNPJ} na tray -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar produto vendido ${id} da loja ${loja.LTR_CNPJ} na tray -> ${response.data.message}`);
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY -> ${error}`
        });
        throw new Error(`Erro de conexão com API da TRAY`);
    }
}
