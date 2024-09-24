import { ILojaTray } from './../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";
import { IEstoqueProduto } from "../interfaces";


export async function getEstoqueProdutosComVariacao(loja: ILojaTray, conexao: any, ids: number[]): Promise<IEstoqueProduto[]> {
    try {
        let estoque;
        if (loja.LTR_TIPO_ESTOQUE === 1)
            estoque = 'ESG.ESG_ATUAL'
        else
            estoque = 'ESG.ESG_APOIO'

        const lojasEstoque = loja.LTR_LOJAS_ESTOQUE.split(',').map(codigo => parseInt(codigo.trim()));
        const placeholders = lojasEstoque.map(() => '?').join(', ');

        const query = `
        SELECT
            PRG.prg_id_ecommerce AS "id",
            CAST(SUM(${estoque}) AS INTEGER) AS "stock"
        FROM PROD_GRADES PRG
        JOIN estoque_grades ESG ON ESG.prg_codigo = PRG.PRG_CODIGO
        JOIN PRODUTOS PRO ON PRG.PRO_CODIGO = PRO.PRO_CODIGO
        WHERE 
            ESG.loj_codigo IN (${placeholders})
            and PRG.PRG_ID_ECOMMERCE is not null
            and PRO.PRO_SITUACAO = 'A'
        GROUP BY PRG.PRG_ID_ECOMMERCE
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
        logger.log({
            level: 'error',
            message: `Erro de conexao com o banco da loja ${loja.LTR_CNPJ} -> ${error}`
        });
        throw new Error(`Erro de conexao com o banco da loja ${loja.LTR_CNPJ}`)
    }
}