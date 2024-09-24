import { ILojaTray } from '../../../interfaces/ILojaTray';
import logger from "../../../utils/logger";
import { IVariacaoProdutoNaoIntegrada } from "../interfaces";


export async function getVariacoesProduto(loja: ILojaTray, conexao: any, product_id: number): Promise<IVariacaoProdutoNaoIntegrada[]> {
    try {

        const query = `
        SELECT
            PRO.PRO_ID_ECOMMERCE as "product_id",
            PRG.prg_codigo as "ean",
            TRIM('Cor') as "type_1",
            COR.cor_descricao as "value_1",
            TRIM('Tamanho') as "type_2",
            TAM.tam_descricao as "value_2"
        FROM PROD_GRADES PRG
        JOIN PRODUTOS PRO ON PRG.pro_codigo = PRO.pro_codigo
        JOIN TAMANHOS TAM ON TAM.tam_codigo = PRG.tam_codigo
        JOIN CORES COR ON COR.cor_codigo = PRG.cor_codigo
        WHERE PRG.prg_id_ecommerce is null
        and PRO.PRO_ID_ECOMMERCE = ?
        `;

        const params = [
            product_id,
        ]

        return new Promise((resolve, reject) => {
            conexao.query(query, params, (err: any, result: IVariacaoProdutoNaoIntegrada[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexao com o banco da loja ${loja.LTR_CNPJ} -> ${error}`
        });
        throw new Error(`Erro de conexao com o banco da loja ${loja.LTR_CNPJ}`)
    }


}