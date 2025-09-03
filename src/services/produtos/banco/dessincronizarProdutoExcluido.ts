import { ILojaTray } from "../../../interfaces/ILojaTray";
import logger from "../../../utils/logger";


export async function dessincronizarProdutoExcluido(loja: ILojaTray, conexao: any, PRO_CODIGO: string): Promise<any> {
    try {

        const updateQuery = `
                UPDATE PRODUTOS PRO
                SET 
                    PRO_ID_ECOMMERCE = null,
                    PRO_ECOMMERCE = null
                WHERE PRO.PRO_CODIGO = ?
            `;

        const params = [
            PRO_CODIGO
        ];

        await new Promise((resolve, reject) => {
            conexao.query(updateQuery, params, (err: any) => {
                if (err) return reject(err);
                resolve(true);
            });
        });

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao dessincronizar produto excluido ${PRO_CODIGO} da loja ${loja.LTR_CNPJ}`
        });
    }

}