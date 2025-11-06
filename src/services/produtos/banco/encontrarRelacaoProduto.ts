import { ILojaTray } from "../../../interfaces/ILojaTray";
import logger from "../../../utils/logger";


export async function encontrarRelacaoProduto(loja: ILojaTray, conexao: any, id: number): Promise<any> {
    try {

        const selectSql = `
      SELECT PRO.PRO_CODIGO AS PRO_CODIGO
      FROM PRODUTOS PRO
      WHERE PRO.PRO_ID_ECOMMERCE = ?
    `;

        const produto: { PRO_CODIGO: number } | undefined = await new Promise((resolve, reject) => {
            conexao.query(selectSql, [id], (err: any, rows: any[]) => {
                if (err) return reject(err);
                resolve(rows?.[0]);
            });
        });

        if (!produto) return null;

        return produto.PRO_CODIGO;

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao encontrar relação do produto ${id} da loja ${loja.LTR_NOME} -> ${error} / ${error?.message}`
        });
    }

}