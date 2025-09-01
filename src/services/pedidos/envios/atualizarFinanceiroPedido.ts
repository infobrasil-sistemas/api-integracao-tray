import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { IOrder } from '../../pedidos/interfaces';

export async function atualizarFinanceiroPedido(loja: ILojaTray, transaction: any, pedido: IOrder, VEN_NUMERO: number, descontoTotalItens: number): Promise<void> {
    try {
        let FP1_CODIGO;
        let PP1_CODIGO;
        const data = dayjs(pedido.date).format('YYYY-MM-DD')

        if (pedido.payment_method.toLowerCase().includes('boleto')) {
            FP1_CODIGO = 9997;
            PP1_CODIGO = pedido.installment || 1
        } else if (pedido.payment_method.toLowerCase().includes('pix')) {
            FP1_CODIGO = 9998;
            PP1_CODIGO = 99
        } else if (pedido.payment_method.toLowerCase().includes('cartao')) {
            FP1_CODIGO = 9999;
            PP1_CODIGO = pedido.installment || 1
        } else {
            throw new Error('A forma de pagamento do pedido é inexistente ou inválida')
        }

        const descontoTotalVenda = descontoTotalItens + (pedido.discount || 0)
        const totalBruto = pedido.partial_total + descontoTotalItens
        const financeiroAtualizar = {
            PP1_CODIGO: PP1_CODIGO,
            FP1_CODIGO: FP1_CODIGO,
            VEN_TOTALPP1: pedido.total || 0.00,
            VEN_TOTALPPA1: pedido.total || 0.00,
            VEN_TOTALBRUTO: totalBruto,
            VEN_TOTALDESC: descontoTotalVenda,
            VEN_TOTALACRESC: pedido.taxes || 0.00,
            VEN_VALORENT: pedido.shipment_value || 0.00,
            // VEN_TAXAPAG: pedido.payment_method_rate || 0.00,
            VEN_TOTALLIQUIDO: (totalBruto + (pedido.taxes || 0) - descontoTotalVenda),
            VEN_DATABASE1: data
        };

        const query = `
            UPDATE VENDAS
            SET
                PP1_CODIGO = ?,
                FP1_CODIGO = ?,
                VEN_TOTALPP1 = ?,
                VEN_TOTALPPA1 = ?,
                VEN_TOTALBRUTO = ?,
                VEN_TOTALDESC = ?,
                VEN_TOTALACRESC = ?, 
                VEN_VALORENT = ?,
                --VEN_TAXAPAG = ?,
                VEN_TOTALLIQUIDO = ?,
                VEN_DATABASE1 = ?
            
            WHERE VENDAS.VEN_NUMERO = ?
        `;

        const values = [
            financeiroAtualizar.PP1_CODIGO,
            financeiroAtualizar.FP1_CODIGO,
            financeiroAtualizar.VEN_TOTALPP1,
            financeiroAtualizar.VEN_TOTALPPA1,
            financeiroAtualizar.VEN_TOTALBRUTO,
            financeiroAtualizar.VEN_TOTALDESC,
            financeiroAtualizar.VEN_TOTALACRESC,
            financeiroAtualizar.VEN_VALORENT,
            // financeiroAtualizar.VEN_TAXAPAG,
            financeiroAtualizar.VEN_TOTALLIQUIDO,
            financeiroAtualizar.VEN_DATABASE1,
            VEN_NUMERO,
        ];

        return new Promise((resolve, reject) => {
            transaction.query(query, values, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    } catch (error) {
        throw new Error(`Erro ao atualizar financeiro do pedido ${VEN_NUMERO} da loja ${loja.LTR_CNPJ} -> ${error}`);
    }
}
