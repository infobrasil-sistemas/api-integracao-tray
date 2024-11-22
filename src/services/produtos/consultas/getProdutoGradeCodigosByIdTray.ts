import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IProductDadosCusto } from '../../pedidos/interfaces';


export async function getProdutoGradeCodigosByIdTray(loja: ILojaTray, transaction: any, id: number): Promise<IProductDadosCusto> {
    try {
        const query = `
        SELECT
            PRG.PRG_CODIGO,
            PRO.PRO_CODIGO,
            PRO.PRO_PRCCUSTO,
            PRO.PRO_PRCCOMPRA,
            PRO.PRO_CUSTOFISCAL,
            PRO.PRO_PRCCOMPRAFISCAL
        FROM PROD_GRADES PRG
        JOIN PRODUTOS PRO ON PRG.PRO_CODIGO = PRO.PRO_CODIGO
        WHERE PRG.PRG_ID_ECOMMERCE = ? 
        `;

        const params = [
            id
        ]

        return new Promise((resolve, reject) => {
            transaction.query(query, params, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0] || null);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter códigos do produto grade ${id} da loja ${loja.LTR_CNPJ} -> ${error}`)
    }

}