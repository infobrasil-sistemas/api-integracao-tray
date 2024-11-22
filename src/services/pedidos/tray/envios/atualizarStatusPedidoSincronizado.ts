import { ILojaTray } from '../../../../interfaces/ILojaTray';
import axios from 'axios';

export async function atualizarStatusPedidoSincronizado(loja: ILojaTray, accessToken: string, pedido_id: number): Promise<void> {
    try {
        const requestBody = {
            Order: {
                status_id: loja.LTR_ID_STATUS_SINCRONIZADO,
            }
        };

        await axios.put(`${loja.LTR_API_HOST}/orders/${pedido_id}?access_token=${accessToken}`, requestBody);

    } catch (error: any) {
        throw new Error(`Erro ao atualizar status do pedido sincronizado ${pedido_id} -> ${error}`)
    }

}