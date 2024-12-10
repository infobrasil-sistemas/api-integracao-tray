import { IDadosEnderecoAtualizar } from '../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";

export async function atualizarDadosEndereco(dadosEndereco: IDadosEnderecoAtualizar, conexao: any): Promise<void> {
    try {
        const fields = [];
        const values: any = [];

        if (dadosEndereco.DAD_HOST) {
            fields.push('DAD_HOST = ?');
            values.push(dadosEndereco.DAD_HOST);
        }
        if (dadosEndereco.DAD_PORTA) {
            fields.push('DAD_PORTA = ?');
            values.push(dadosEndereco.DAD_PORTA);
        }
        if (dadosEndereco.DAD_CAMINHO) {
            fields.push('DAD_CAMINHO = ?');
            values.push(dadosEndereco.DAD_CAMINHO);
        }
        if (dadosEndereco.DAD_USER) {
            fields.push('DAD_USER = ?');
            values.push(dadosEndereco.DAD_USER);
        }
        if (dadosEndereco.DAD_ID) {
            fields.push('DAD_ID = ?');
            values.push(dadosEndereco.DAD_ID);
        }

        const query = `
            UPDATE DADOS_ENDERECO
            SET ${fields.join(', ')}
            WHERE DAD_CNPJ = ?
        `;
        values.push(dadosEndereco.DAD_CNPJ);

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
            message: `Erro ao atualizar dados de endereço da loja ${dadosEndereco.DAD_CNPJ} no banco da API -> ${error}`
        });
        throw new Error(`Erro ao atualizar dados de endereço da loja ${dadosEndereco.DAD_CNPJ} no banco da API -> ${error}`);
    }
}
