import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IEstoqueProduto } from '../../interfaces';

export async function atualizarEstoque(loja: ILojaTray, accessToken: string, estoque: IEstoqueProduto) {
    try {
        
        const requestBody = {
            Product: {
                stock: loja.LTR_ESTOQUE_MINIMO > estoque.stock ? 0 : estoque.stock
            }
        };

        await axios.put(`${loja.LTR_API_HOST}/products/${estoque.id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} -> ${error.data}`
        });
    }

}