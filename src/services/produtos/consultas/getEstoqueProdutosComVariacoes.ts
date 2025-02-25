import dayjs from "dayjs";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getCamposPreco } from "../../../utils/getCamposPreco";
import { IEstoqueProduto } from "../interfaces";

export async function getEstoqueProdutosComVariacao(loja: ILojaTray, conexao: any, ultimaSincronizacao: string): Promise<IEstoqueProduto[]> {
    try {
        let estoque = loja.LTR_TIPO_ESTOQUE === 1 ? 'ESG.ESG_ATUAL' : 'ESG.ESG_APOIO';

        const camposPreco = getCamposPreco(loja.LTR_TABELA_PRECO);
        const lojasEstoque = loja.LTR_LOJAS_ESTOQUE.split(',')
            .map(codigo => parseInt(codigo.trim()))
            .filter(codigo => !isNaN(codigo)); // Garante que apenas números válidos sejam usados

        if (lojasEstoque.length === 0) {
            throw new Error("Nenhuma loja de estoque válida encontrada.");
        }

        const placeholders = lojasEstoque.map(() => '?').join(', ');

        const query = `
        SELECT
            PRG.prg_id_ecommerce AS "id",
            PRO.pro_codigo AS "pro_codigo",
            CAST(SUM(${estoque}) AS INTEGER) AS "stock", -- Soma o estoque corretamente
            MAX(CAST(${camposPreco.campo_preco} AS NUMERIC(9,2))) AS "price", -- Mantém um único preço por grupo
            MAX(
                CASE
                    WHEN ${camposPreco.campo_preco_promocional} <= 0 THEN NULL
                    ELSE CAST(${camposPreco.campo_preco_promocional} AS NUMERIC(9,2))
                END
            ) AS "promotional_price", -- Mantém um único preço promocional por grupo
            MAX(est.est_dtinipromocao) AS "start_promotion", -- Mantém uma única data de início de promoção
            MAX(est.est_dtfinpromocao) AS "end_promotion", -- Mantém uma única data de fim de promoção
            MAX(CAST(est.ipi_cod_sai AS NUMERIC(9,2))) AS "ipi_value" -- Mantém um único valor de IPI por grupo
        FROM PROD_GRADES PRG
        JOIN estoque_grades ESG ON ESG.prg_codigo = PRG.PRG_CODIGO
        JOIN PRODUTOS PRO ON PRG.PRO_CODIGO = PRO.PRO_CODIGO
        JOIN ESTOQUE EST ON EST.pro_codigo = PRO.PRO_CODIGO AND EST.LOJ_CODIGO = ?
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

        const params = [
            loja.LOJ_CODIGO,
            ...lojasEstoque,
            ultimaSincronizacao // Agora a data é passada de forma segura
        ];

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IEstoqueProduto[]) => {
                if (err) {
                    return reject(err);
                }

                const estoqueProdutosFormatado = result.map(estoque => ({
                    ...estoque,
                    start_promotion: estoque.start_promotion ? dayjs(estoque.start_promotion).format('YYYY-MM-DD') : null,
                    end_promotion: estoque.end_promotion ? dayjs(estoque.end_promotion).format('YYYY-MM-DD') : null,
                }));

                resolve(estoqueProdutosFormatado);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter estoque dos produtos com variação da loja ${loja.LTR_CNPJ}: ${error}`);
    }
}
