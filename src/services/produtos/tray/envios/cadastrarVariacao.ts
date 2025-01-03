import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IProdutoVariacaoNaoIntegrado } from '../../interfaces';

export async function cadastrarVariacao(loja: ILojaTray, conexao: any, accessToken: string, produtoVariacao: IProdutoVariacaoNaoIntegrado) {
    try {

        const requestBody = {
            Variant: produtoVariacao
        }

        const response = await axios.post(`${loja.LTR_API_HOST}/products/variants/?access_token=${accessToken}`, requestBody);

        const updateQuery = `
                UPDATE PROD_GRADES PRG
                SET 
                    PRG_ID_ECOMMERCE = ?
                WHERE PRG.PRG_CODIGO = ?
            `;

        const params = [
            parseInt(response.data.id),
            produtoVariacao.ean
        ];

        await new Promise((resolve, reject) => {
            conexao.query(updateQuery, params, (err: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });

        return response.data.id

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar variação ${produtoVariacao.ean} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao cadastrar variação ${produtoVariacao.ean} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }

}