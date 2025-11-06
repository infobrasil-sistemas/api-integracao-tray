import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IVariacaoProdutoIntegrada } from "../interfaces";


export async function getVariacoesProdutoIntegradas(loja: ILojaTray, conexao: any, product_id: number): Promise<IVariacaoProdutoIntegrada[]> {
    try {

        const query = `
        SELECT
            PRG.PRG_ID_ECOMMERCE as "id",
            PRG.prg_codigo as "ean",
            COR.cor_descricao as "value_1",
            TAM.tam_descricao as "value_2"
        FROM PROD_GRADES PRG
        JOIN PRODUTOS PRO ON PRG.pro_codigo = PRO.pro_codigo
        JOIN TAMANHOS TAM ON TAM.tam_codigo = PRG.tam_codigo
        JOIN CORES COR ON COR.cor_codigo = PRG.cor_codigo
        WHERE PRG.prg_id_ecommerce is not null AND PRO.PRO_ECOMMERCE = 'S'
        and PRO.PRO_ID_ECOMMERCE = ?
        `;

        const params = [
            product_id,
        ]

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IVariacaoProdutoIntegrada[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao obter variacoes do produto ${product_id} da loja ${loja.LTR_NOME}`)
    }


}