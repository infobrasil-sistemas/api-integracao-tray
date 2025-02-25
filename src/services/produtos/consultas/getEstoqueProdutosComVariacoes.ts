import dayjs from "dayjs";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getCamposPreco } from "../../../utils/getCamposPreco";
import { IEstoqueProduto } from "../interfaces";

export async function getEstoqueProdutosComVariacao(
    loja: ILojaTray,
    conexao: any,
    ultimaSincronizacao: string
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
            PRO.pro_codigo AS "pro_codigo",
            CAST(SUM(${estoque}) AS INTEGER) AS "stock", -- Soma o estoque de todas as lojas
            CAST(MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN ${camposPreco.campo_preco} END) AS NUMERIC(9,2)) AS "price", -- Preço apenas da loja 1
            CAST(MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN ${camposPreco.campo_preco_promocional} END) AS NUMERIC(9,2)) AS "promotional_price", -- Preço promocional da loja 1
            MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.est_dtinipromocao END) AS "start_promotion",
            MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.est_dtfinpromocao END) AS "end_promotion",
            CAST(MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.ipi_cod_sai END) AS NUMERIC(9,2)) AS "ipi_value"
        FROM PROD_GRADES PRG
        JOIN estoque_grades ESG ON ESG.prg_codigo = PRG.PRG_CODIGO
        JOIN PRODUTOS PRO ON PRG.PRO_CODIGO = PRO.PRO_CODIGO
        JOIN ESTOQUE EST ON EST.pro_codigo = PRO.PRO_CODIGO AND EST.loj_codigo = ESG.loj_codigo
        WHERE 
            ESG.loj_codigo IN (${placeholders})
            AND PRG.PRG_ID_ECOMMERCE IS NOT NULL
            AND PRO.PRO_ECOMMERCE = 'S'
            AND PRO.PRO_SITUACAO = 'A'
            AND (EST.EST_DTALTERACAOQTD >= ? OR EST.EST_DTALTERACAO = CURRENT_DATE)
        GROUP BY 
            PRG.PRG_ID_ECOMMERCE, 
            PRO.PRO_CODIGO
        `;

        const params = [...lojasEstoque, ultimaSincronizacao];

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IEstoqueProduto[]) => {
                if (err) {
                    return reject(err);
                }

                const estoqueProdutosFormatado = result.map((estoque) => ({
                    ...estoque,
                    start_promotion: estoque.start_promotion
                        ? dayjs(estoque.start_promotion).format("YYYY-MM-DD")
                        : null,
                    end_promotion: estoque.end_promotion
                        ? dayjs(estoque.end_promotion).format("YYYY-MM-DD")
                        : null,
                }));

                resolve(estoqueProdutosFormatado);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter estoque dos produtos com variação da loja ${loja.LTR_CNPJ}: ${error}`);
    }
}
