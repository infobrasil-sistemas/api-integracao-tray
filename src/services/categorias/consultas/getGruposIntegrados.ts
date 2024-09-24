import { IConnectionOptions, getLojaDatabaseConnection } from "../../../config/db/lojaDatabase";
import logger from "../../../utils/logger";
import { IGrupoIntegrado } from "../interfaces";


export async function getGruposIntegrados(lojaCnpj: string, conexao: any): Promise<IGrupoIntegrado[]> {
    try {

        const query = `
                SELECT
                GRU.GRU_ID_ECOMMERCE AS "id",
                GRU.GRU_descricao as "name",
                SEC.sec_id_ecommerce as "parent_id"
                FROM GRUPOSPRO GRU JOIN SECCAO SEC ON GRU.sec_codigo = SEC.sec_codigo
                WHERE GRU.GRU_ID_ECOMMERCE is not null  
            `;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: IGrupoIntegrado[]) => {
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