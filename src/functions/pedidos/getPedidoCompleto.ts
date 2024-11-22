import { ILojaTray } from "../../interfaces/ILojaTray";
import { IOrder } from "../../services/pedidos/interfaces";
import { getPedido } from "../../services/pedidos/tray/consultas/getPedido";
import logger from "../../utils/logger";

export async function getPedidoCompleto(loja: ILojaTray, access_token: string, id: number): Promise<IOrder | undefined> {
    try {
        return await getPedido(loja, access_token, id);
    } catch (error) {
        logger.log({
            level: 'error',
            message: `${error}`
        });
    }
}
