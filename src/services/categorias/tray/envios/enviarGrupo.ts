import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import { IGrupoNaoIntegrado } from '../../interfaces';
import axios from 'axios';
import { getLojaDatabaseConnection, IConnectionOptions } from '../../../../config/db/lojaDatabase';

export async function enviarGrupo(loja: ILojaTray, dadosConexao: IConnectionOptions, accessToken: string, grupo: IGrupoNaoIntegrado) {
    try {
        const { GRU_CODIGO, ...grupoSemCodigo } = grupo

        const requestBody = {
            Category: grupoSemCodigo
        }

        const response = await axios.post(`${loja.LTR_API_HOST}/categories?access_token=${accessToken}`, requestBody);

        if (response.status === 201 || response.status === 200) {
            const conexao = await getLojaDatabaseConnection(dadosConexao)

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

            logger.log({
                level: 'info',
                message: `Grupo ${grupo.name} da loja ${loja.LTR_CNPJ} cadastrada com sucesso.`
            });

        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar grupo ${grupo.name} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar grupo ${grupo.name} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}