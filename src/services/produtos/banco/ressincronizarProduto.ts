import { ILojaTray } from "../../../interfaces/ILojaTray";
import logger from "../../../utils/logger";


export async function ressincronizarProduto(loja: ILojaTray, conexao: any, produto: { id: number, reference: string }): Promise<any> {
    try {
        if (!produto.reference) {
            logger.log({
                level: 'info',
                message: `Produto ${produto.id} sem referencia.`
            });
        }
        const selectSql = `
      SELECT PRO.PRO_CODIGO AS pro_codigo
      FROM PRODUTOS PRO
      WHERE PRO.PRO_ID_ECOMMERCE IS NULL 
      AND PRO.PRO_SITUACAO = 'A'
      AND (PRO.PRO_REF = ? OR PRO.PRO_CODIGO = ?)
    `;

        const candidato: { PRO_CODIGO: number } | undefined = await new Promise((resolve, reject) => {
            conexao.query(selectSql, [produto.reference, produto.reference], (err: any, rows: any[]) => {
                if (err) return reject(err);
                resolve(rows?.[0]);
            });
        });

        // Se não achou nenhum candidato que satisfaça o WHERE, não tem o que atualizar
        if (!candidato) return null;


        // 2) Executa o UPDATE
        const updateSql = `
      UPDATE PRODUTOS PRO
      SET 
        PRO.PRO_ID_ECOMMERCE = ?,
        PRO.PRO_ECOMMERCE = 'S'
      WHERE PRO.PRO_CODIGO = ?
    `;

        const params = [produto.id, candidato.PRO_CODIGO];

        await new Promise((resolve, reject) => {
            conexao.query(updateSql, params, (err: any, res: any) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

        return candidato.PRO_CODIGO;

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao ressincronizar produto ${produto.id} da loja ${loja.LTR_NOME} -> ${error} / ${error?.message}`
        });
    }
}