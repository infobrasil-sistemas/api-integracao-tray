import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';

export async function getCategorias(loja: ILojaTray, accessToken: string) {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/categories/`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            return response.data.Categories
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar categorias da loja ${loja.LTR_CNPJ} -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar categorias da loja ${loja.LTR_CNPJ} -> ${response.data.message}`)
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY`
        })
        throw new Error(`Erro de conexão com API da TRAY`)
    }

}