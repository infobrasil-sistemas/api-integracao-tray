import axios from 'axios';
import { ILojaTray } from './../../../interfaces/ILojaTray';
import { getApiDatabaseConnection } from '../../../config/db/database';
import logger from '../../../utils/logger';

export async function atualizarAccessToken(loja: ILojaTray) {
    try {
        const { LTR_API_HOST, LTR_REFRESH_TOKEN } = loja;


        const response = await axios.get(`${LTR_API_HOST}/auth?refresh_token=${LTR_REFRESH_TOKEN}`);

        if (response.status === 201 || response.status === 200) {
            const conexao = await getApiDatabaseConnection()

            const updateQuery = `
                UPDATE LOJAS_TRAY
                SET 
                    LTR_ACCESS_TOKEN = ?,
                    LTR_EXPIRATION_ACESS_TOKEN = ?,
                    LTR_DT_ALTERACAO = CURRENT_TIMESTAMP
                WHERE LTR_CODIGO = ?
            `;

            const params = [
                response.data.access_token,
                new Date(response.data.date_expiration_access_token),
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
                message: `Access token da loja ${loja.LTR_CNPJ} atualizado com sucesso.`
            });

            return response.data.access_token
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar Access token da loja ${loja.LTR_CNPJ} -> ${response.data.message}`
            });
            throw new Error(`Erro ao atualizar Access token da loja ${loja.LTR_CNPJ} -> ${response.data.message}`)
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar Access token da loja ${loja.LTR_CNPJ} -> ${error}`
        });
        throw new Error(`Erro ao atualizar Access token da loja ${loja.LTR_CNPJ} -> ${error}`)
    }

}