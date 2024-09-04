import { getLojaDatabaseConnection, IConnectionOptions } from "../../../config/db/lojaDatabase";
import logger from "../../../utils/logger";
import { IProdutoNaoIntegrado } from "../interfaces";


export async function getProdutosNaoIntegrados(dadosConexao: IConnectionOptions): Promise<IProdutoNaoIntegrado[]> {
    try {
        const conexao = await getLojaDatabaseConnection(dadosConexao)

        const query = `
       SELECT
        pro.pro_codigo AS "ean",
        SUBSTRING(PRO.pro_descricao FROM 1 FOR 200) AS "name",
        SUBSTRING(PRO.pro_ncm FROM 1 FOR 8) AS "ncm",
        PRO.pro_especificacao AS "description",
        PRO.pro_descfiscal AS "description_small",

        0.00 AS "price",

        CAST(PRO.pro_prccusto AS NUMERIC(9,2)) AS "cost_price",
        0.00 AS "promotional_price",

        null AS "start_promotion",
        null AS "end_promotion",

        CAST(PRO.pro_ipi AS NUMERIC(9,2)) AS "ipi_value",
        MAR.mar_descricao AS "brand",
        null AS "model",
        CAST(pro.pro_peso AS INTEGER) AS "weight",
        CAST(PRO.pro_comprimento AS INTEGER) AS "length",
        CAST(PRO.pro_altura AS INTEGER) AS "width",
        CAST(PRO.pro_altura AS INTEGER) AS "height",
        0 AS "stock",

        GRU.gru_id_ecommerce AS "category_id",
        1 AS "available",
        null AS "availability",
        null AS "availability_days",
        PRO.pro_ref AS "reference",
        0 AS "hot",
        0 AS "release_mudar",
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
    WHERE PRO.PRO_ECOMMERCE = 'S' AND PRO.PRO_INTEGRADO_TRAY = 'N' AND PRO.PRO_SITUACAO = 'A'
`;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: IProdutoNaoIntegrado[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexao com o banco da API -> ${error}`
        });
        throw new Error(`Erro de conexao com o banco da API`)
    }


}