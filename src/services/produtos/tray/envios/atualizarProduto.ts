import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoIntegrado } from '../../interfaces';

export async function atualizarProduto(loja: ILojaTray, accessToken: string, produto: IProdutoIntegrado) {
    try {
        const requestBody = {
            Product: {
                ...produto,
            }
        };
        await axios.put(`${loja.LTR_API_HOST}/products/${produto.id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao atualizar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}