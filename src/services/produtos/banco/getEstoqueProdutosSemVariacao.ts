import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { getCamposPreco } from '../../../utils/getCamposPreco';
import { IEstoqueProduto } from "../interfaces";

export async function getEstoqueProdutosSemVariacao(
    loja: ILojaTray,
    conexao: any,
    idsProdutosComVariacao: string[],
): Promise<IEstoqueProduto[]> {
    try {
        let estoque = loja.LTR_TIPO_ESTOQUE === 1 ? 'EST.EST_ATUAL' : 'EST.EST_APOIO';
        const LOJ_CODIGO = loja.LOJ_CODIGO

        const camposPreco = getCamposPreco(loja.LTR_TABELA_PRECO);
        const lojasEstoque = loja.LTR_LOJAS_ESTOQUE.split(',')
            .map(codigo => parseInt(codigo.trim()))

        const placeholdersLojas = lojasEstoque.map(() => '?').join(',');
        const placeholdersProdutos = idsProdutosComVariacao.length > 0
            ? `AND PRO.PRO_CODIGO NOT IN (${idsProdutosComVariacao.map(() => '?').join(',')})`
            : '';

        const query = `
                        SELECT
                PRO.pro_id_ecommerce AS "id",
                PRO.pro_codigo       AS "pro_codigo",
                PRO.pro_ref          AS "reference",
                -- Soma estoque de TODAS as lojas do IN
                CAST(SUM(${estoque}) AS INTEGER) AS "stock",
                
                -- Demais campos “pivotados” para a loja principal (LOJ_CODIGO)
                CAST(
                MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN ${camposPreco.campo_preco} END)
                AS NUMERIC(9,2)
                ) AS "price",

                CAST(
                MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN ${camposPreco.campo_desconto} END)
                AS NUMERIC(9,2)
            ) AS "desconto",

               MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.EST_DTINIPROMOCAO END) AS "start_promotion",
               MAX(CASE WHEN EST.loj_codigo = ${LOJ_CODIGO} THEN EST.EST_DTFINPROMOCAO END) AS "end_promotion",

                --CAST(
            --    MAX(CASE WHEN ESG.loj_codigo = ${LOJ_CODIGO} THEN EST.ipi_cod_sai END)
            --    AS NUMERIC(9,2)
            --) AS "ipi_value"
            0 as "ipi_value"

            FROM PRODUTOS PRO
            JOIN ESTOQUE EST
            ON EST.pro_codigo = PRO.pro_codigo

            WHERE
            -- Somente linhas das lojas desejadas
            EST.loj_codigo IN (${placeholdersLojas})
            
            ${placeholdersProdutos}  -- (se houver filtro para excluir certos produtos)
            
            -- Produto ativo no e-commerce
            AND PRO.PRO_ID_ECOMMERCE IS NOT NULL
            AND PRO.PRO_ECOMMERCE = 'S'
            AND PRO.PRO_SITUACAO = 'A'

            -- Verifica se pelo menos uma das lojas do produto foi alterada
            AND EXISTS (
                SELECT 1
                FROM ESTOQUE E2
                WHERE E2.pro_codigo = PRO.pro_codigo
                AND E2.loj_codigo IN (${placeholdersLojas})
                AND (CAST(E2.EST_DTALTERACAOQTD AS DATE) = CURRENT_DATE or E2.est_dtalteracao = CURRENT_DATE)
            )

            GROUP BY 
            PRO.pro_id_ecommerce,
            PRO.pro_codigo

        `;

        // Definir os parâmetros corretamente
        const params = [
            ...lojasEstoque,
            ...(idsProdutosComVariacao.length > 0 ? idsProdutosComVariacao : []),
            ...lojasEstoque,
        ];

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IEstoqueProduto[]) => {
                if (err) {
                    return reject(err);
                }

                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter estoque dos produtos da loja ${loja.LTR_CNPJ}: ${error}`);
    }
}
