import { IConnectionOptions, getLojaDatabaseConnection } from "../../../config/db/lojaDatabase";
import logger from "../../../utils/logger";
import { ISecaoIntegrada } from "../interfaces";


export async function getSecoesIntegradas(lojaCnpj: string, dadosConexao: IConnectionOptions): Promise<ISecaoIntegrada[]> {
    try {
        const conexao = await getLojaDatabaseConnection(dadosConexao)

        const query = `
           SELECT
                SEC.SEC_ID_ECOMMERCE AS "id",
                SEC.sec_descricao as "name"
                FROM SECCAO SEC
                WHERE SEC.sec_id_ecommerce is not null 
                --AND SEC.SEC_CODIGO IN (1, 2)
            `;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: ISecaoIntegrada[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com o banco da loja ${lojaCnpj} -> ${error}`
        });
        throw new Error(`Erro de conexão com o banco da loja ${lojaCnpj} -> ${error}`)
    }
}