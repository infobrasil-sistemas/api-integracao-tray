import { ILojaTray } from './../../../interfaces/ILojaTray';
import { IEstoqueProduto } from "../interfaces";


export async function getEstoqueProdutos(loja: ILojaTray, conexao: any): Promise<IEstoqueProduto[]> {
    try {
        let estoque;
        if (loja.LTR_TIPO_ESTOQUE === 1)
            estoque = 'EST.EST_ATUAL'
        else
            estoque = 'EST.EST_APOIO'

        const lojasEstoque = loja.LTR_LOJAS_ESTOQUE.split(',').map(codigo => parseInt(codigo.trim()));
        const placeholders = lojasEstoque.map(() => '?').join(', ');

        const query = `
        SELECT
            PRO.pro_id_ecommerce AS "id",
            PRO.pro_descfiscal AS "name",
            CAST(SUM(${estoque}) AS INTEGER) AS "stock"
        FROM PRODUTOS PRO
        JOIN estoque EST ON EST.pro_codigo = PRO.pro_codigo
        WHERE 
            EST.loj_codigo IN (${placeholders})
            and PRO.PRO_ID_ECOMMERCE is not null 
            and PRO.PRO_ECOMMERCE = 'S'
            and PRO.PRO_SITUACAO = 'A'
        GROUP BY PRO.PRO_ID_ECOMMERCE, pro.pro_descfiscal
        `;

        const params = [
            ...lojasEstoque
        ]

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IEstoqueProduto[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter estoque dos produtos da loja ${loja.LTR_CNPJ}`)
    }
}