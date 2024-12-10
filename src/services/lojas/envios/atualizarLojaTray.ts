import { ILojaTrayAtualizar } from '../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";

export async function atualizarLojaTray(loja: ILojaTrayAtualizar, conexao: any): Promise<void> {
    try {
        const fields = [];
        const values: any = [];

        if (loja.LTR_LOJAS_ESTOQUE) {
            fields.push('LTR_LOJAS_ESTOQUE = ?');
            values.push(loja.LTR_LOJAS_ESTOQUE);
        }
        if (loja.LTR_TABELA_PRECO !== undefined) {
            fields.push('LTR_TABELA_PRECO = ?');
            values.push(loja.LTR_TABELA_PRECO);
        }
        if (loja.LTR_TIPO_ESTOQUE !== undefined) {
            fields.push('LTR_TIPO_ESTOQUE = ?');
            values.push(loja.LTR_TIPO_ESTOQUE);
        }
        if (loja.LTR_STORE_ID !== undefined) {
            fields.push('LTR_STORE_ID = ?');
            values.push(loja.LTR_STORE_ID);
        }
        if (loja.LTR_API_HOST) {
            fields.push('LTR_API_HOST = ?');
            values.push(loja.LTR_API_HOST);
        }
        if (loja.LTR_CODE) {
            fields.push('LTR_CODE = ?');
            values.push(loja.LTR_CODE);
        }
        if (loja.LTR_CONSUMER_KEY) {
            fields.push('LTR_CONSUMER_KEY = ?');
            values.push(loja.LTR_CONSUMER_KEY);
        }
        if (loja.LTR_CONSUMER_SECRET) {
            fields.push('LTR_CONSUMER_SECRET = ?');
            values.push(loja.LTR_CONSUMER_SECRET);
        }
        if (loja.LTR_INTERMEDIADOR_PAGAMENTO) {
            fields.push('LTR_INTERMEDIADOR_PAGAMENTO = ?');
            values.push(loja.LTR_INTERMEDIADOR_PAGAMENTO);
        }
        if (loja.LTR_ID_STATUS_SINCRONIZADO !== undefined) {
            fields.push('LTR_ID_STATUS_SINCRONIZADO = ?');
            values.push(loja.LTR_ID_STATUS_SINCRONIZADO);
        }
        if (loja.LTR_SITUACAO !== undefined) {
            fields.push('LTR_SITUACAO = ?');
            values.push(loja.LTR_SITUACAO);
        }
        if (loja.LTR_ESTOQUE_MINIMO !== undefined) {
            fields.push('LTR_ESTOQUE_MINIMO = ?');
            values.push(loja.LTR_ESTOQUE_MINIMO);
        }

        fields.push('LTR_DT_ALTERACAO = CURRENT_TIMESTAMP');


        const query = `
            UPDATE LOJAS_TRAY
            SET ${fields.join(', ')}
            WHERE LTR_CNPJ = ?
        `;
        values.push(loja.LTR_CNPJ);

        return new Promise((resolve, reject) => {
            conexao.query(query, values, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar loja ${loja.LTR_CNPJ} no banco da API -> ${error}`
        });
        throw new Error(`Erro ao atualizar loja ${loja.LTR_CNPJ} no banco da API -> ${error}`);
    }
}
