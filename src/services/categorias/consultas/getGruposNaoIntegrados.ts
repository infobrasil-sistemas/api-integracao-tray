import { IConnectionOptions, getLojaDatabaseConnection } from "../../../config/db/lojaDatabase";
import logger from "../../../utils/logger";
import { IGrupoNaoIntegrado } from "../interfaces";


export async function getGruposNaoIntegrados(lojaCnpj: string, dadosConexao: IConnectionOptions): Promise<IGrupoNaoIntegrado[]> {
    try {
        const conexao = await getLojaDatabaseConnection(dadosConexao)

        const query = `
            SELECT
                GRU.GRU_CODIGO,
                GRU.GRU_descricao as "name",
                null as "slug",
                GRU.GRU_descricao as "title",
                GRU.GRU_descricao as "small_description",
                null as "has_acceptance_term",
                null as "acceptance_term",
                null as "Metatag",
                null as "keywords" ,    
                null as "description",
                null as "property",
                SEC.SEC_ID_ECOMMERCE as "parent_id"
                FROM GRUPOSPRO GRU JOIN SECCAO SEC ON GRU.sec_codigo = SEC.SEC_CODIGO
                WHERE GRU.gru_id_ecommerce is null 
                AND SEC.SEC_ID_ECOMMERCE is not null
            `;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: IGrupoNaoIntegrado[]) => {
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