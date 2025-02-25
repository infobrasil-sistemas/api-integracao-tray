import axios from 'axios';
import { ILojaTray } from './../../../interfaces/ILojaTray';
import logger from '../../../utils/logger';

export async function atualizarTokens(loja: ILojaTray, conexao: any) {
    try {
        const { LTR_CONSUMER_KEY, LTR_CONSUMER_SECRET, LTR_CODE, LTR_API_HOST } = loja;

        const requestBody = {
            consumer_key: LTR_CONSUMER_KEY,
            consumer_secret: LTR_CONSUMER_SECRET,
            code: LTR_CODE
        };

        const response = await axios.post(`${LTR_API_HOST}/auth`, requestBody);

        const updateQuery = `
                UPDATE LOJAS_TRAY
                SET 
                    LTR_ACCESS_TOKEN = ?,
                    LTR_REFRESH_TOKEN = ?,
                    LTR_EXPIRATION_ACCESS_TOKEN = ?,
                    LTR_EXPIRATION_REFRESH_TOKEN = ?,
                    LTR_DT_ALTERACAO = CURRENT_TIMESTAMP
                WHERE LTR_CODIGO = ?
            `;

        const params = [
            response.data.access_token,
            response.data.refresh_token,
            response.data.date_expiration_access_token, 
            response.data.date_expiration_refresh_token, 
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
            message: `Tokens da loja ${loja.LTR_CNPJ} atualizados com sucesso.`
        });

        return response.data.access_token
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar tokens da loja ${loja.LTR_CNPJ} -> ${error}`
        });
        throw new Error(`Erro ao atualizar tokens da loja ${loja.LTR_CNPJ} -> ${error}`)
    }

}
