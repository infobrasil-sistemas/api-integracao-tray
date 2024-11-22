import logger from "../../../utils/logger";


export async function getDadCodigoByCnpj(cnpj: string, conexao: any): Promise<number | null> {
    try {
        const query = `
        SELECT
            DAD_CODIGO
        FROM DADOS_ENDERECO DAD
        WHERE DAD_CNPJ = ? 
        `;

        const params = [
            cnpj.replace(/[^\d]/g, '')
        ]

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: { DAD_CODIGO: number }[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]?.DAD_CODIGO || null);
            });
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao obter DAD_CODIGO da loja ${cnpj} -> ${error}`
        });
        throw new Error(`Erro ao obter DAD_CODIGO da loja ${cnpj} -> ${error}`)
    }

}