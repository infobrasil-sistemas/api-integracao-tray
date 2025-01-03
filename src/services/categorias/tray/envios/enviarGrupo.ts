import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import { IGrupoNaoIntegrado } from '../../interfaces';
import axios from 'axios';

export async function enviarGrupo(loja: ILojaTray, conexao: any, accessToken: string, grupo: IGrupoNaoIntegrado) {
    try {
        const { GRU_CODIGO, ...grupoSemCodigo } = grupo

        const requestBody = {
            Category: grupoSemCodigo
        }

        const response = await axios.post(`${loja.LTR_API_HOST}/categories?access_token=${accessToken}`, requestBody);

        const updateQuery = `
                UPDATE GRUPOSPRO GRU
                SET 
                    GRU_ID_ECOMMERCE = ?
                WHERE GRU.GRU_CODIGO = ?
            `;

        const params = [
            parseInt(response.data.id),
            GRU_CODIGO
        ];

        await new Promise((resolve, reject) => {
            conexao.query(updateQuery, params, (err: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar grupo ${grupo.name} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao cadastrar grupo ${grupo.name} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}