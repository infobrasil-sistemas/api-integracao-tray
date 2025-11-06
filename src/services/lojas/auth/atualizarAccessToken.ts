import axios from 'axios';
import { ILojaTray } from './../../../interfaces/ILojaTray';
import logger from '../../../utils/logger';

export async function atualizarAccessToken(loja: ILojaTray, conexao: any) {
    try {
        const { LTR_API_HOST, LTR_REFRESH_TOKEN } = loja;

        const response = await axios.get(`${LTR_API_HOST}/auth`, {
            params: {
                refresh_token: LTR_REFRESH_TOKEN,
            },
        });
        const updateQuery = `
                UPDATE LOJAS_TRAY
                SET 
                    LTR_ACCESS_TOKEN = ?,
                    LTR_EXPIRATION_ACCESS_TOKEN = ?,
                    LTR_DT_ALTERACAO = CURRENT_TIMESTAMP
                WHERE LTR_CODIGO = ?
            `;

        const params = [
            response.data.access_token,
            response.data.date_expiration_access_token,
            loja.LTR_CODIGO
        ];

        await new Promise((resolve, reject) => {
            conexao.query(updateQuery, params, (err: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });

        logger.log({
            level: 'info',
            message: `Access token da loja ${loja.LTR_NOME} atualizado com sucesso.`
        });

        return response.data.access_token

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar Access token da loja ${loja.LTR_NOME} -> 
            Status: ${error.response?.status || 'Sem status'} 
            Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
            Endpoint: ${error.response?.data.url || ''}`
        });
        return null
    }

}
