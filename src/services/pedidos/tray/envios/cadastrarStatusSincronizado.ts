import { ILojaTrayInicializar } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';

export async function cadastrarStatusSincronizado(loja: ILojaTrayInicializar, accessToken: string): Promise<number> {
    try {

        const requestBody = {
            OrderStatus: {
                status: "A ENVIAR - SINCRONIZADO",
                description: "PEDIDO SINCRONIZADO COM O SISTEMA RETAGUARDA.",
                background: "#f0a818",
                default: 1,
                type: "open"
            }
        };

        const response = await axios.post(`${loja.LTR_API_HOST}/orders/statuses?access_token=${accessToken}`, requestBody);
        return response.data.id

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar status SINCRONIZADO na inicialização da loja ${loja.LTR_NOME} -> ${error}`
        });
        throw new Error(`Erro ao cadastrar status SINCRONIZADO na inicialização da loja ${loja.LTR_NOME} -> ${error}`)
    }

}