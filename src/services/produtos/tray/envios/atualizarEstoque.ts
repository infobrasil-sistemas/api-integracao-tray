import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { IEstoqueProduto } from '../../interfaces';

export async function atualizarEstoque(loja: ILojaTray, accessToken: string, estoque: IEstoqueProduto) {
    try {

        const requestBody = {
            Product: {
                stock: estoque.stock
            }
        };

        const response = await axios.put(`${loja.LTR_API_HOST}/products/${estoque.id}?access_token=${accessToken}`, requestBody);
        if (response.status === 201 || response.status === 200) {
            logger.log({
                level: 'info',
                message: `Estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} atualizado com sucesso.`
            });
        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar estoque do produto ${estoque.name} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}