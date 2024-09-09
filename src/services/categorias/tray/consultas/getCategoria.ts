import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';

export async function getCategoria(loja: ILojaTray, accessToken: string, id: number) {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/categories/${id}`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            return response.data.Category
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar categoria ${id} da loja ${loja.LTR_CNPJ} -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar categoria ${id} da loja ${loja.LTR_CNPJ} -> ${response.data.message}`)
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY`
        })
        throw new Error(`Erro de conexão com API da TRAY`)
    }

}