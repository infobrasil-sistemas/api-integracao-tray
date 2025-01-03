import axios from "axios";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { IOrder } from "../../services/pedidos/interfaces";
import { getPedido } from "../../services/pedidos/tray/consultas/getPedido";
import logger from "../../utils/logger";

export async function getPedidoCompleto(loja: ILojaTray, access_token: string, id: number): Promise<IOrder | undefined> {
    try {
        return await getPedido(loja, access_token, id);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro ao obter dados do pedido ${id} da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado ao obter dados do pedido ${id} da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }
}
