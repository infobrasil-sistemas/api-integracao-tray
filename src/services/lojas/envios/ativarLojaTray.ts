import { ILojaTray } from '../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";

export async function ativarLojaTray(loja: ILojaTray, conexao: any): Promise<void> {
    try {

        const query = `
            UPDATE LOJAS_TRAY
            SET LTR_SITUACAO = 'A'
            WHERE LTR_CODIGO = ${loja.LTR_CODIGO}
        `;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao ativar loja ${loja.LTR_CNPJ} no banco da API -> ${error}`
        });
        throw new Error(`Erro ao ativar loja ${loja.LTR_CNPJ} no banco da API -> ${error}`);
    }
}
