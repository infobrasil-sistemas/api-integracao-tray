import { ILojaTrayInicializada } from '../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";

export async function cadastrarLojaTray(loja: ILojaTrayInicializada, conexao: any): Promise<number> {
    try {

        const LTR_CODIGO = 'GEN_ID(GEN_CODIGOLTR, 1)';

        const query = `
            INSERT INTO LOJAS_TRAY
            (
                LTR_CODIGO,
                LOJ_CODIGO,
                LTR_CNPJ,
                LTR_LOJAS_ESTOQUE,
                LTR_TABELA_PRECO,
                LTR_TIPO_ESTOQUE,
                LTR_ESTOQUE_MINIMO,
                DAD_CODIGO,
                LTR_STORE_ID,
                LTR_API_HOST,
                LTR_CODE,
                LTR_CONSUMER_KEY,
                LTR_CONSUMER_SECRET,
                LTR_ACCESS_TOKEN,
                LTR_REFRESH_TOKEN,
                LTR_EXPIRATION_ACCESS_TOKEN,
                LTR_EXPIRATION_REFRESH_TOKEN,
                LTR_INTERMEDIADOR_PAGAMENTO,
                LTR_ID_STATUS_SINCRONIZADO,
                LTR_DT_CADASTRO,
                LTR_DT_ALTERACAO
            )
            VALUES (${LTR_CODIGO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING LTR_CODIGO
        `;

        const values = [
            loja.LOJ_CODIGO,
            loja.LTR_CNPJ,
            loja.LTR_LOJAS_ESTOQUE,
            loja.LTR_TABELA_PRECO,
            loja.LTR_TIPO_ESTOQUE,
            loja.LTR_ESTOQUE_MINIMO,
            loja.DAD_CODIGO,
            loja.LTR_STORE_ID,
            loja.LTR_API_HOST,
            loja.LTR_CODE,
            loja.LTR_CONSUMER_KEY,
            loja.LTR_CONSUMER_SECRET,
            loja.LTR_ACCESS_TOKEN,
            loja.LTR_REFRESH_TOKEN,
            loja.LTR_EXPIRATION_ACCESS_TOKEN,
            loja.LTR_EXPIRATION_REFRESH_TOKEN,
            loja.LTR_INTERMEDIADOR_PAGAMENTO || null,
            loja.LTR_ID_STATUS_SINCRONIZADO
        ];

        return new Promise((resolve, reject) => {
            conexao.query(query, values, (err: any, result: { LTR_CODIGO: number }) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.LTR_CODIGO);
            });
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar loja ${loja.LTR_CNPJ} no banco da API -> ${error}`
        });
        throw new Error(`Erro ao cadastrar loja ${loja.LTR_CNPJ} no banco da API -> ${error}`);
    }
}
