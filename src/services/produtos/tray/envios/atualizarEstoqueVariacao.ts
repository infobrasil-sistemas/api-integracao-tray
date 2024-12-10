import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IEstoqueProduto } from '../../interfaces';

export async function atualizarEstoqueVariacao(loja: ILojaTray, accessToken: string, estoque: IEstoqueProduto) {
    try {

        const requestBody = {
            Variant: {
                stock: loja.LTR_ESTOQUE_MINIMO > estoque.stock ? 0 : estoque.stock
            }
        };

        await axios.put(`${loja.LTR_API_HOST}/products/variants/${estoque.id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar estoque da variação ${estoque.id} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}