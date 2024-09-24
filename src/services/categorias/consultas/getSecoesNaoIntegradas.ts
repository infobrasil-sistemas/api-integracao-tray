import logger from "../../../utils/logger";
import { ISecaoNaoIntegrada } from "../interfaces";


export async function getSecoesNaoIntegradas(lojaCnpj: string, conexao: any): Promise<ISecaoNaoIntegrada[]> {
    try {

        const query = `
           SELECT
                SEC.SEC_CODIGO,
                SEC.sec_descricao as "name",
                null as "slug",
                SEC.sec_descricao as "title",
                SEC.sec_descricao as "small_description",
                null as "has_acceptance_term",
                null as "acceptance_term",
                null as "Metatag",
                null as "keywords" ,    
                null as "description",
                null as "property"
                FROM SECCAO SEC 
                WHERE SEC.sec_id_ecommerce is null 
                --AND SEC.SEC_CODIGO IN (1, 2)
            `;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: ISecaoNaoIntegrada[]) => {
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