import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoNaoIntegrado } from '../../interfaces';
import dayjs from 'dayjs';

export async function cadastrarProduto(loja: ILojaTray, conexao: any, accessToken: string, produto: IProdutoNaoIntegrado): Promise<number | undefined> {
    try {

        const startPromotionDate = produto.start_promotion ? dayjs(produto.start_promotion).toDate() : null;
        const endPromotionDate = produto.end_promotion ? dayjs(produto.end_promotion).toDate() : null;

        const requestBody = {
            Product: {
                ...produto,
                start_promotion: startPromotionDate,
                end_promotion: endPromotionDate
            }
        };

        const response = await axios.post(`${loja.LTR_API_HOST}/products?access_token=${accessToken}`, requestBody);
        if (response.status === 201 || response.status === 200) {

            const updateQuery = `
                UPDATE PRODUTOS PRO
                SET 
                    PRO_ID_ECOMMERCE = ?
                WHERE PRO.PRO_CODIGO = ?
            `;

            const params = [
                parseInt(response.data.id),
                produto.ean
            ];

            await new Promise((resolve, reject) => {
                conexao.query(updateQuery, params, (err: any) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });

            logger.log({
                level: 'info',
                message: `Produto ${produto.ean} da loja ${loja.LTR_CNPJ} cadastrado com sucesso.`
            });

            return response.data.id
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar produto ${produto.ean} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar produto ${produto.ean} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}