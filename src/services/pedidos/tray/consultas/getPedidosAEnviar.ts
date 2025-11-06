import { ILojaTray } from '../../../../interfaces/ILojaTray';
import axios from 'axios';

export async function getPedidosAEnviar(loja: ILojaTray, accessToken: string): Promise<number[]> {
  try {
    // helper pra fazer GET genérico
    async function fetchOrders(status: string): Promise<number[]> {
      const response = await axios.get(`${loja.LTR_API_HOST}/orders`, {
        params: {
          access_token: accessToken,
          status,
        },
      });
      const orders = response.data?.Orders || [];
      return orders.map((o: any) => parseInt(o.Order.id));
    }

    let idOrders: number[] = [];

    // se for VINDI, busca os dois status
    if (loja.LTR_INTERMEDIADOR_PAGAMENTO === 'VINDI') {
      const [aEnviarVindi, aEnviar] = await Promise.all([
        fetchOrders('A ENVIAR VINDI'),
        fetchOrders('A ENVIAR'),
      ]);

      // junta e remove duplicados
      idOrders = Array.from(new Set([...aEnviarVindi, ...aEnviar]));
    } else {
      // lojas normais — só o status A ENVIAR
      idOrders = await fetchOrders('A ENVIAR');
    }

    return idOrders;
  } catch (error) {
    throw new Error(
      `Erro ao buscar pedidos a enviar da loja ${loja.LTR_NOME}: ${error}`
    );
  }
}
