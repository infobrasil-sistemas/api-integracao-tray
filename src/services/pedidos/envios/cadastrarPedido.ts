import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IOrder } from '../../pedidos/interfaces';

export async function cadastrarPedido(loja: ILojaTray, transaction: any, pedido: IOrder, cli_codigo: number): Promise<number> {
    try {

        const data = dayjs(pedido.date).format('YYYY-MM-DD')

        if (!data) {
            throw new Error('Pedido sem data')
        }

        const pedidoInsert = {
            VEN_ID_ECOMMERCE: pedido.id,
            VEN_NUMSITE: pedido.id.toString(),
            SIT_CODIGO: 1,
            LOJ_CODIGO: loja.LOJ_CODIGO,
            USU_CODIGO: 9999,
            FUN_CODIGO: 9999,
            CLI_CODIGO: cli_codigo,
            VEN_TIPO: "E",
            VEN_PRECO: loja.LTR_TABELA_PRECO,
            VEN_DATA: data,
            VEN_HORA: pedido.hour,
            VEN_OBS: `Tipo de frete: ${pedido.shipment} | Loja obs: ${pedido.store_note} | Cliente obs: ${pedido.customer_note}`,
        };

        const VEN_NUMERO = 'GEN_ID(GEN_NUMEROVEN, 1)';


        const query = `
            INSERT INTO VENDAS
            (
                VEN_NUMERO,
                VEN_ID_ECOMMERCE,
                VEN_NUMSITE,
                SIT_CODIGO,               
                LOJ_CODIGO,
                USU_CODIGO,
                FUN_CODIGO,
                CLI_CODIGO,
                VEN_TIPO,
                VEN_PRECO,
                VEN_DATA,
                VEN_HORA,
                VEN_OBS
            )
            VALUES (${VEN_NUMERO}, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING VEN_NUMERO
        `;

        const values = [
            pedidoInsert.VEN_ID_ECOMMERCE,
            pedidoInsert.VEN_NUMSITE,
            pedidoInsert.SIT_CODIGO,
            pedidoInsert.LOJ_CODIGO,
            pedidoInsert.USU_CODIGO,
            pedidoInsert.FUN_CODIGO,
            pedidoInsert.CLI_CODIGO,
            pedidoInsert.VEN_TIPO,
            pedidoInsert.VEN_PRECO,
            pedidoInsert.VEN_DATA,
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
