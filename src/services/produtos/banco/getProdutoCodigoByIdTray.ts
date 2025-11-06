import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IProductDadosCusto } from '../../pedidos/interfaces';


export async function getProdutoCodigoByIdTray(loja: ILojaTray, transaction: any, id: number): Promise<IProductDadosCusto> {
    try {
        const query = `
        SELECT
            PRO.PRO_CODIGO,
            PRO.PRO_PRCCUSTO,
            PRO.PRO_PRCCOMPRA,
            PRO.PRO_CUSTOFISCAL,
            PRO.PRO_PRCCOMPRAFISCAL
        FROM PRODUTOS PRO
        WHERE PRO.PRO_ID_ECOMMERCE = ? 
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
        throw new Error(`Erro ao obter código do produto ${id} da loja ${loja.LTR_NOME} -> ${error}`)
    }

}