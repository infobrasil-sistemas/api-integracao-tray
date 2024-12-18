import { ILojaTray } from '../../../interfaces/ILojaTray';

export async function getProdutosComVariacoes(loja: ILojaTray, conexao: any): Promise<number[]> {
    try {

        const query = `
        SELECT DISTINCT
        PRO.PRO_ID_ECOMMERCE AS "id"
        FROM produtos PRO
        JOIN PROD_GRADES PRG ON PRG.pro_codigo = PRO.PRO_CODIGO;
        `;

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (err: any, result: number[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter produtos com variação da loja ${loja.LTR_CNPJ}`)
    }
}