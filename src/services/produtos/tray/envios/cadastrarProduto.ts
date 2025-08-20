import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoNaoIntegrado } from '../../interfaces';

export async function cadastrarProduto(loja: ILojaTray, conexao: any, accessToken: string, produto: IProdutoNaoIntegrado): Promise<number | undefined> {
    try {

        const requestBody = {
            Product: {
                ...produto,
            }
        };
        const response = await axios.post(`${loja.LTR_API_HOST}/products?access_token=${accessToken}`, requestBody);

        const updateQuery = `
                UPDATE PRODUTOS PRO
                SET 
                    PRO_ID_ECOMMERCE = ?
                WHERE PRO.PRO_CODIGO = ?
            `;

        const updateEstoqueQuery = `
            UPDATE ESTOQUE EST
            SET 
                EST.EST_DTALTERACAOQTD = CURRENT_DATE
            WHERE EST.PRO_CODIGO = ?
        `;

        const params = [
            parseInt(response.data.id),
            produto.ean
        ];

        const paramsUpdateEstoque = [
            produto.ean
        ];

        await new Promise((resolve, reject) => {
            conexao.query(updateQuery, params, (err: any) => {
                if (err) return reject(err);

                // Após o primeiro update, executa o segundo
                conexao.query(updateEstoqueQuery, paramsUpdateEstoque, (err: any) => {
                    if (err) return reject(err);
                    resolve(true);
                });
            });
        });

        return response.data.id

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao cadastrar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}