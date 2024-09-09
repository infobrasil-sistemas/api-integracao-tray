import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import { ISecaoNaoIntegrada } from '../../interfaces';
import axios from 'axios';
import { getLojaDatabaseConnection, IConnectionOptions } from '../../../../config/db/lojaDatabase';

export async function enviarSecao(loja: ILojaTray, dadosConexao: IConnectionOptions, accessToken: string, secao: ISecaoNaoIntegrada) {
    try {
        const { SEC_CODIGO, ...secaoSemCodigo } = secao

        const requestBody = {
            Category: secaoSemCodigo
        }

        const response = await axios.post(`${loja.LTR_API_HOST}/categories?access_token=${accessToken}`, requestBody);

        if (response.status === 201 || response.status === 200) {
            const conexao = await getLojaDatabaseConnection(dadosConexao)

            const updateQuery = `
                UPDATE SECCAO SEC
                SET 
                    SEC_ID_ECOMMERCE = ?
                WHERE SEC.SEC_CODIGO = ?
            `;

            const params = [
                parseInt(response.data.id),
                SEC_CODIGO
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
                message: `Seção ${secao.name} da loja ${loja.LTR_CNPJ} cadastrada com sucesso.`
            });

        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar seção ${secao.name} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar seção ${secao.name} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}