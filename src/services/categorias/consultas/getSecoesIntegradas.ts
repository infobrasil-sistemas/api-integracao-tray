import logger from "../../../utils/logger";
import { ISecaoIntegrada } from "../interfaces";


export async function getSecoesIntegradas(lojaCnpj: string, conexao: any): Promise<ISecaoIntegrada[]> {
    try {

        const query = `
           SELECT
                SEC.SEC_ID_ECOMMERCE AS "id",
                SEC.sec_descricao as "name"
                FROM SECCAO SEC
                WHERE SEC.sec_id_ecommerce is not null 
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
        throw new Error(`Erro ao obter seções da loja ${lojaCnpj} -> ${error}`)
    }
}