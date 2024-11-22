import { ILojaTray } from '../../../../interfaces/ILojaTray';
import axios from 'axios';

export async function getPedidosAEnviar(loja: ILojaTray, accessToken: string): Promise<number[]> {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/orders`, {
            params: {
                access_token: accessToken,
                status: loja.LTR_INTERMEDIADOR_PAGAMENTO === "VINDI" ? "A ENVIAR VINDI" : "A ENVIAR",
                id: 7047
            }
        });

        const orders = response.data.Orders;
        const idOrders = orders.map((order: any) => parseInt(order.Order.id))
        return idOrders

    } catch (error) {
        throw new Error(`Erro ao buscar pedidos da loja ${loja.LTR_CNPJ}`);
    }
}
