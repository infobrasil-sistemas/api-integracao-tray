import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IProdutoNaoIntegrado } from "../interfaces";


export async function getProdutosNaoIntegrados(loja: ILojaTray, conexao: any): Promise<IProdutoNaoIntegrado[]> {
    try {

        const query = `
       SELECT
        pro.pro_codigo AS "ean",
        PRO.pro_descricao AS "name",
        SUBSTRING(PRO.pro_ncm FROM 1 FOR 8) AS "ncm",
        PRO.pro_especificacao AS "description",
        SUBSTRING(PRO.pro_descricao FROM 1 FOR 200) AS "description_small",

        0 AS "price",

        CAST(PRO.pro_prccusto AS NUMERIC(9,2)) AS "cost_price",

        0 AS "ipi_value",
        MAR.mar_descricao AS "brand",
        null AS "model",

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

        0 AS "stock",

        GRU.gru_id_ecommerce AS "category_id",
        0 AS "available",
        null AS "availability",
        null AS "availability_days",
        --PRO.pro_ref AS "reference",
        0 AS "hot",
        0 AS "release",
        null AS "additional_button",
        null AS "related_categories",
        null AS "release_date",
        null AS "metatag",
        null AS "type",
        null AS "content",
        null AS "local"
    FROM PRODUTOS PRO
    JOIN MARCAS MAR ON MAR.mar_codigo = PRO.mar_codigo
    JOIN GRUPOSPRO GRU ON PRO.gru_codigo = GRU.gru_codigo
    WHERE PRO.PRO_ECOMMERCE = 'S' AND PRO.PRO_ID_ECOMMERCE is null AND PRO.PRO_SITUACAO = 'A'
`;

        const params = [
            loja.LOJ_CODIGO,
        ]

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IProdutoNaoIntegrado[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter produtos nao integrados da loja ${loja.LTR_CNPJ}`)
    }


}