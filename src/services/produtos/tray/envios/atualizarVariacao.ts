import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoVariacaoIntegrado } from '../../interfaces';

export async function atualizarVariacao(loja: ILojaTray, accessToken: string, variacao: IProdutoVariacaoIntegrado) {
    try {

        const requestBody = {
            Variant: {
                ...variacao,
            }
        };

        await axios.put(`${loja.LTR_API_HOST}/products/variants/${variacao.id}?access_token=${accessToken}`, requestBody);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar variação ${variacao.ean} da loja ${loja.LTR_NOME} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao atualizar variação ${variacao.ean} da loja ${loja.LTR_NOME} -> ${error.message}`
            });
        }
    }

}