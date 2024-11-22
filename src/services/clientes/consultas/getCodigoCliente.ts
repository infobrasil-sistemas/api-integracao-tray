import { ILojaTray } from '../../../interfaces/ILojaTray';

export async function getCodigoCliente(loja: ILojaTray, transaction: any, id: number, documento: string): Promise<number | null> {
    try {
        const query = `
        SELECT
            CLI.CLI_CODIGO
        FROM CLIENTES CLI
        WHERE (CLI.cli_id_ecommerce = ?) or (CLI.cli_cpf_cnpj = ?)
        `;

        const params = [id, documento.replace(/[.-]/g, '')]

        return new Promise((resolve, reject) => {
            transaction.query(query, params, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]?.CLI_CODIGO || null);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter código do cliente ${id} da loja ${loja.LTR_CNPJ} -> ${error}`)
    }
}