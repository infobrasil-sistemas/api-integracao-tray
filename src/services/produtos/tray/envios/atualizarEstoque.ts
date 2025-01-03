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
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}