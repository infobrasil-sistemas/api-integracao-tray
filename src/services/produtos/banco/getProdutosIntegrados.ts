import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IProdutoIntegrado } from "../interfaces";


export async function getProdutosIntegrados(loja: ILojaTray, conexao: any): Promise<IProdutoIntegrado[]> {
    try {

        const query = `
       SELECT
        pro.pro_id_ecommerce as "id",
        pro.pro_codigo AS "ean",
        PRO.pro_descricao AS "name",
        SUBSTRING(PRO.pro_ncm FROM 1 FOR 8) AS "ncm",
        PRO.pro_especificacao AS "description",
        SUBSTRING(PRO.pro_descricao FROM 1 FOR 200) AS "description_small",

        CAST(PRO.pro_prccusto AS NUMERIC(9,2)) AS "cost_price",

        MAR.mar_descricao AS "brand",

        CASE
            WHEN PRO.PRO_PESO is null or PRO.PRO_PESO < 1 THEN 1
            ELSE CAST(pro.pro_peso AS INTEGER)
        END as "weight",

        CASE
            WHEN PRO.pro_comprimento is null or PRO.pro_comprimento < 1 THEN 1
            ELSE CAST(pro.pro_comprimento AS INTEGER)
        END as "length",

        CASE
            WHEN PRO.pro_largura is null or PRO.pro_largura < 1 THEN 1
            ELSE CAST(pro.pro_largura AS INTEGER)
        END as "width",

        CASE
            WHEN PRO.pro_altura is null or PRO.pro_altura < 1 THEN 1
            ELSE CAST(pro.pro_altura AS INTEGER)
        END as "height",

        GRU.gru_id_ecommerce AS "category_id",

        CASE
            WHEN PRO.pro_situacao = 'A' THEN 1
            ELSE 0
        END "available",

        PRO.pro_ref AS "reference"

    FROM PRODUTOS PRO
    JOIN MARCAS MAR ON MAR.mar_codigo = PRO.mar_codigo
    JOIN GRUPOSPRO GRU ON PRO.gru_codigo = GRU.gru_codigo
    WHERE PRO.PRO_ECOMMERCE = 'S' AND PRO.PRO_ID_ECOMMERCE is not null
    AND PRO.PRO_DATAALTERACAO = CURRENT_DATE
`;

        return new Promise((resolve, reject) => {
            conexao.query(query, (err: any, result: IProdutoIntegrado[]) => {
                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter produtos integrados da loja ${loja.LTR_CNPJ}`)
    }
}