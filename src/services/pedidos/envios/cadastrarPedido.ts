import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IOrder } from '../../pedidos/interfaces';

export async function cadastrarPedido(loja: ILojaTray, transaction: any, pedido: IOrder, cli_codigo: number): Promise<number> {
    try {

        const pedidoInsert = {
            VEN_ID_ECOMMERCE: pedido.id,
            SIT_CODIGO: 1,
            LOJ_CODIGO: loja.LOJ_CODIGO,
            USU_CODIGO: 9999,
            FUN_CODIGO: 9999,
            CLI_CODIGO: cli_codigo,
            VEN_TIPO: "E",
            VEN_PRECO: loja.LTR_TABELA_PRECO,

            VEN_DATA: pedido.date && dayjs(pedido.date).isValid()
                ? dayjs(pedido.date).format('YYYY-MM-DD')
                : null,

            VEN_DATABASE1: pedido.date && dayjs(pedido.date).isValid()
                ? dayjs(pedido.date).format('YYYY-MM-DD')
                : null,

            VEN_HORA: pedido.hour,
            VEN_OBS: `Tipo de frete: ${pedido.shipment} | Loja obs: ${pedido.store_note} | Cliente obs: ${pedido.customer_note}`,
        };

        const VEN_NUMERO = 'GEN_ID(GEN_NUMEROVEN, 1)';


        const query = `
            INSERT INTO VENDAS
            (
                VEN_NUMERO,
                VEN_ID_ECOMMERCE,
                SIT_CODIGO,               
                LOJ_CODIGO,
                USU_CODIGO,
                FUN_CODIGO,
                CLI_CODIGO,
                VEN_TIPO,
                VEN_PRECO,
                VEN_DATA,
                VEN_DATABASE1,
                VEN_HORA,
                VEN_OBS
            )
            VALUES (${VEN_NUMERO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING VEN_NUMERO
        `;

        const values = [
            pedidoInsert.VEN_ID_ECOMMERCE,
            pedidoInsert.SIT_CODIGO,
            pedidoInsert.LOJ_CODIGO,
            pedidoInsert.USU_CODIGO,
            pedidoInsert.FUN_CODIGO,
            pedidoInsert.CLI_CODIGO,
            pedidoInsert.VEN_TIPO,
            pedidoInsert.VEN_PRECO,
            pedidoInsert.VEN_DATA,
            pedidoInsert.VEN_DATABASE1,
            pedidoInsert.VEN_HORA,
            pedidoInsert.VEN_OBS
        ];

        return new Promise((resolve, reject) => {
            transaction.query(query, values, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.VEN_NUMERO);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao inserir pedido ${pedido.id} na loja ${loja.LTR_CNPJ} -> ${error}`);
    }
}
