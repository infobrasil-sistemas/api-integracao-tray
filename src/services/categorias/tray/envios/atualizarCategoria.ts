import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';

export async function atualizarCategoria(loja: ILojaTray, accessToken: string, categoria: any, id: number) {
    try {

        const requestBody = {
            Category: categoria
        }

        const response = await axios.put(`${loja.LTR_API_HOST}/categories/${id}?access_token=${accessToken}`, requestBody);

        if (response.status === 201 || response.status === 200) {

            logger.log({
                level: 'info',
                message: `Categoria ${categoria.name} da loja ${loja.LTR_CNPJ} atualizada com sucesso.`
            });

        }
        else {
            logger.log({
                level: 'error',
                message: `Erro ao atualizar categoria ${categoria.name} da loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar categoria ${categoria.name} da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}