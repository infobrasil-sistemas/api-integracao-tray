import { IDadosEndereco } from '../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";

export async function cadastrarDadosEndereco(dadosEndereco: IDadosEndereco, conexao: any): Promise<number> {
    try {

        const DAD_CODIGO = 'GEN_ID(GEN_CODIGODAD, 1)';

        const query = `
            INSERT INTO DADOS_ENDERECO
            (
                DAD_CODIGO,
                DAD_HOST,
                DAD_PORTA,
                DAD_USER,
                DAD_CAMINHO,
                DAD_CNPJ,
                DAD_ID
            )
            VALUES (${DAD_CODIGO}, ?, ?, ?, ?, ?, ?)
            RETURNING DAD_CODIGO
        `;

        const values = [
            dadosEndereco.DAD_HOST,
            dadosEndereco.DAD_PORTA,
            dadosEndereco.DAD_USER,
            dadosEndereco.DAD_CAMINHO,
            dadosEndereco.DAD_CNPJ,
            dadosEndereco.DAD_ID
        ];

        return new Promise((resolve, reject) => {
            conexao.query(query, values, (err: any, result: { DAD_CODIGO: number }) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.DAD_CODIGO);
            });
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar dados de endereço da loja ${dadosEndereco.DAD_CNPJ} no banco da API -> ${error}`
        });
        throw new Error(`Erro ao cadastrar dados de endereço da loja ${dadosEndereco.DAD_CNPJ} no banco da API -> ${error}`);
    }
}
