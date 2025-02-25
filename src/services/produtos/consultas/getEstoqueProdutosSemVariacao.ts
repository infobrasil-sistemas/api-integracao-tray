import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { getCamposPreco } from '../../../utils/getCamposPreco';
import { IEstoqueProduto } from "../interfaces";

export async function getEstoqueProdutosSemVariacao(
    loja: ILojaTray,
    conexao: any,
    idsProdutosComVariacao: string[],
    ultimaSincronizacao: string
): Promise<IEstoqueProduto[]> {
    try {
        let estoque = loja.LTR_TIPO_ESTOQUE === 1 ? 'EST.EST_ATUAL' : 'EST.EST_APOIO';

        const camposPreco = getCamposPreco(loja.LTR_TABELA_PRECO);
        const lojasEstoque = loja.LTR_LOJAS_ESTOQUE.split(',')
            .map(codigo => parseInt(codigo.trim()))
            .filter(codigo => !isNaN(codigo)); // Garante que apenas números válidos sejam usados

        if (lojasEstoque.length === 0) {
            throw new Error("Nenhuma loja de estoque válida encontrada.");
        }

        const placeholdersLojas = lojasEstoque.map(() => '?').join(', ');
        const placeholdersProdutos = idsProdutosComVariacao.length > 0
            ? `AND PRO.PRO_CODIGO NOT IN (${idsProdutosComVariacao.map(() => '?').join(', ')})`
            : '';

        const query = `
                SELECT
                    PRO.pro_id_ecommerce AS "id",
                    PRO.pro_codigo AS "pro_codigo",
                    CAST(SUM(${estoque}) AS INTEGER) AS "stock", -- Soma o estoque
                    CAST(${camposPreco.campo_preco} AS NUMERIC(9,2)) AS "price", -- Preço direto
                    CASE
                        WHEN ${camposPreco.campo_preco_promocional} <= 0 THEN NULL
                        ELSE CAST(${camposPreco.campo_preco_promocional} AS NUMERIC(9,2))
                    END AS "promotional_price", -- Preço promocional direto
                    est.est_dtinipromocao AS "start_promotion", -- Data de início da promoção
                    est.est_dtfinpromocao AS "end_promotion", -- Data de fim da promoção
                    CAST(est.ipi_cod_sai AS NUMERIC(9,2)) AS "ipi_value" -- IPI direto
            FROM PRODUTOS PRO
            JOIN estoque EST ON EST.pro_codigo = PRO.pro_codigo
            WHERE 
                EST.loj_codigo IN (${placeholdersLojas})
                ${placeholdersProdutos}
                AND PRO.PRO_ID_ECOMMERCE IS NOT NULL 
                AND PRO.PRO_ECOMMERCE = 'S'
                AND PRO.PRO_SITUACAO = 'A'
                AND (EST.EST_DTALTERACAOQTD >= ? OR EST.EST_DTALTERACAO = CURRENT_DATE)
            GROUP BY 
                PRO.PRO_ID_ECOMMERCE, 
                PRO.pro_codigo, 
                ${camposPreco.campo_preco}, 
                ${camposPreco.campo_preco_promocional},
                est.est_dtinipromocao,
                est.est_dtfinpromocao,
                est.ipi_cod_sai

        `;

        // Definir os parâmetros corretamente
        const params = [
            ...lojasEstoque,
            ...(idsProdutosComVariacao.length > 0 ? idsProdutosComVariacao : []),
            ultimaSincronizacao
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
        throw new Error(`Erro ao obter estoque dos produtos da loja ${loja.LTR_CNPJ}: ${error}`);
    }
}
