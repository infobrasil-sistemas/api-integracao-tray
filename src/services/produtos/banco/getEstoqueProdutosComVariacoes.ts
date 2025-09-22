import dayjs from "dayjs";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getCamposPreco } from "../../../utils/getCamposPreco";
import { IEstoqueProduto } from "../interfaces";

export async function getEstoqueProdutosComVariacao(
    loja: ILojaTray,
    conexao: any,
): Promise<IEstoqueProduto[]> {
    try {
        let estoque = loja.LTR_TIPO_ESTOQUE === 1 ? "ESG.ESG_ATUAL" : "ESG.ESG_APOIO";
        const LOJ_CODIGO = loja.LOJ_CODIGO

        const camposPreco = getCamposPreco(loja.LTR_TABELA_PRECO);
        const lojasEstoque = loja.LTR_LOJAS_ESTOQUE.split(",")
            .map((codigo) => parseInt(codigo.trim()))
            .filter((codigo) => !isNaN(codigo)); // Garante que apenas números válidos sejam usados

        if (lojasEstoque.length === 0) {
            throw new Error("Nenhuma loja de estoque válida encontrada.");
        }

        const placeholders = lojasEstoque.map(() => "?").join(", ");

        const query = `
                SELECT
            PRG.prg_id_ecommerce AS "id",
            PRO.pro_codigo       AS "reference",
            -- Soma dos estoques de todas as lojas do IN (estoque_grades)
            CAST(SUM(${estoque}) AS INTEGER) AS "stock",

            -- "Pivot" dos preços/promo/datas/ipi apenas da loja principal (LOJ_CODIGO)
            CAST(
                MAX(CASE WHEN ESG.loj_codigo = ${LOJ_CODIGO} THEN ${camposPreco.campo_preco} END)
                AS NUMERIC(9,2)
            ) AS "price",
            CAST(
                MAX(CASE WHEN ESG.loj_codigo = ${LOJ_CODIGO} THEN ${camposPreco.campo_desconto} END)
                AS NUMERIC(9,2)
            ) AS "desconto",

            MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.EST_DTINIPROMOCAO END) AS "start_promotion",
            MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.EST_DTFINPROMOCAO END) AS "end_promotion",


            --CAST(
            --    MAX(CASE WHEN ESG.loj_codigo = ${LOJ_CODIGO} THEN EST.ipi_cod_sai END)
            --    AS NUMERIC(9,2)
            --) AS "ipi_value"
            0 as "ipi_value"

        FROM PROD_GRADES PRG
        JOIN estoque_grades ESG 
            ON ESG.prg_codigo = PRG.PRG_CODIGO
        JOIN PRODUTOS PRO 
            ON PRG.PRO_CODIGO = PRO.PRO_CODIGO
        JOIN ESTOQUE EST 
            ON EST.pro_codigo = PRO.pro_codigo
            AND EST.loj_codigo = ESG.loj_codigo

        WHERE 
            ESG.loj_codigo IN (${placeholders})
            AND PRG.PRG_ID_ECOMMERCE IS NOT NULL
            AND PRO.PRO_ECOMMERCE = 'S'
            AND PRO.PRO_SITUACAO = 'A'

            -- Se ao menos uma loja foi alterada (subselect):
            AND EXISTS (
            SELECT 1
                FROM ESTOQUE E2
                    JOIN estoque_grades ESG2 
                        ON ESG2.prg_codigo = PRG.prg_codigo
                        AND ESG2.loj_codigo = E2.loj_codigo
            WHERE E2.pro_codigo = PRO.pro_codigo
                AND ESG2.loj_codigo IN (${placeholders})
                AND (CAST(E2.EST_DTALTERACAOQTD AS DATE) = CURRENT_DATE or E2.est_dtalteracao = CURRENT_DATE)
            )

        GROUP BY 
            PRG.PRG_ID_ECOMMERCE,
            PRO.PRO_CODIGO,
        `;

        const params = [...lojasEstoque, ...lojasEstoque];

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IEstoqueProduto[]) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter estoque dos produtos com variação da loja ${loja.LTR_CNPJ}: ${error}`);
    }
}
