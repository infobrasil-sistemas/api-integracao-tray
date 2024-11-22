import { ILojaTray } from '../../../../interfaces/ILojaTray';
import axios from 'axios';

export async function atualizarCategoria(loja: ILojaTray, accessToken: string, categoria: any, id: number) {
    try {

        const requestBody = {
            Category: categoria
        }

        await axios.put(`${loja.LTR_API_HOST}/categories/${id}?access_token=${accessToken}`, requestBody);

    } catch (error) {
        throw error
    }
}