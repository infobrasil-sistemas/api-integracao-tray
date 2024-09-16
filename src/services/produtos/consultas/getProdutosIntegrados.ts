import { ILojaTray } from './../../../interfaces/ILojaTray';
import { getLojaDatabaseConnection, IConnectionOptions } from "../../../config/db/lojaDatabase";
import logger from "../../../utils/logger";
import { IProdutoIntegrado } from "../interfaces";
import dayjs from 'dayjs';


export async function getProdutosIntegrados(loja: ILojaTray, dadosConexao: IConnectionOptions): Promise<IProdutoIntegrado[]> {
    try {
        const conexao = await getLojaDatabaseConnection(dadosConexao)
        let campo_preco;
        let campo_preco_promocinal;

        switch (loja.LTR_TABELA_PRECO) {
            case 1:
                campo_preco = 'est.pro_preco1';
                campo_preco_promocinal = 'est.pro_precop1';
                break;
            case 2:
                campo_preco = 'est.pro_preco2';
                campo_preco_promocinal = 'est.pro_precop2';
                break;
            case 3:
                campo_preco = 'est.pro_preco3';
                campo_preco_promocinal = 'est.pro_precop3';
                break;
            case 4:
                campo_preco = 'est.pro_preco4';
                campo_preco_promocinal = 'est.pro_precop4';
                break;
            case 5:
                campo_preco = 'est.pro_preco5';
                campo_preco_promocinal = 'est.pro_precop5';
                break;
            case 6:
                campo_preco = 'est.pro_preco6';
                campo_preco_promocinal = 'est.pro_precop6';
                break;
            case 7:
                campo_preco = 'est.pro_preco7';
                campo_preco_promocinal = 'est.pro_precop7';
                break;
            case 8:
                campo_preco = 'est.pro_preco8';
                campo_preco_promocinal = 'est.pro_precop8';
                break;
            case 9:
                campo_preco = 'est.pro_preco9';
                campo_preco_promocinal = 'est.pro_precop9';
                break;
            case 10:
                campo_preco = 'est.pro_preco10';
                campo_preco_promocinal = 'est.pro_precop10';
                break;
            case 11:
                campo_preco = 'est.pro_preco11';
                campo_preco_promocinal = 'est.pro_precop11';
                break;
            case 12:
                campo_preco = 'est.pro_preco12';
                campo_preco_promocinal = 'est.pro_precop12';
                break;
        }


        const query = `
       SELECT
        pro.pro_id_ecommerce as "id",
        pro.pro_codigo AS "ean",
        PRO.pro_descfiscal AS "name",
        SUBSTRING(PRO.pro_ncm FROM 1 FOR 8) AS "ncm",
        PRO.pro_especificacao AS "description",
        SUBSTRING(PRO.pro_descricao FROM 1 FOR 200) AS "description_small",

        CAST(${campo_preco} AS NUMERIC(9,2)) AS "price",

        CAST(PRO.pro_prccusto AS NUMERIC(9,2)) AS "cost_price",
        CAST(${campo_preco_promocinal} AS NUMERIC(9,2)) AS "promotional_price",

        est.est_dtinipromocao AS "start_promotion",
        est.est_dtfinpromocao AS "end_promotion",

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
    JOIN ESTOQUE EST ON EST.pro_codigo = PRO.PRO_CODIGO AND EST.LOJ_CODIGO = ?
    JOIN MARCAS MAR ON MAR.mar_codigo = PRO.mar_codigo
    JOIN GRUPOSPRO GRU ON PRO.gru_codigo = GRU.gru_codigo
    WHERE PRO.PRO_ECOMMERCE = 'S' AND PRO.PRO_ID_ECOMMERCE is not null
`;

        const params = [
            loja.LTR_LOJA_PRECO,
        ]

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IProdutoIntegrado[]) => {
                if (err) {
                    return reject(err);
                }

                const produtosFormatados = result.map(produto => ({
                    ...produto,
                    start_promotion: produto.start_promotion ? dayjs(produto.start_promotion).format('YYYY-MM-DD') : null,
                    end_promotion: produto.end_promotion ? dayjs(produto.end_promotion).format('YYYY-MM-DD') : null,
                    reference: produto.reference === null ? '' : produto.reference
                }));
                resolve(produtosFormatados);
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