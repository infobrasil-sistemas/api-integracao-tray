// import { ILojaTray } from '../../../../interfaces/ILojaTray';
// import logger from '../../../../utils/logger';
// import axios from 'axios';
// import { IPayment } from '../../../pedidos/interfaces';

// export async function getPagamento(loja: ILojaTray, accessToken: string, id: number): Promise<IPayment> {
//     try {
//         const response = await axios.get(`${loja.LTR_API_HOST}/payments/${id}`, {
//             params: {
//                 access_token: accessToken
//             }
//         });

//         if (response.status === 201 || response.status === 200) {
//             const produtoVendido = response.data.Payment;

//             const {
//                 id,
//                 payment_method_id,
//                 value
//             } = produtoVendido;

//             return {
//                 id: parseInt(id),
//                 payment_method_id: parseInt(payment_method_id),
//                 value: parseFloat(value),
//             };
//         } else {
//             logger.log({
//                 level: 'error',
//                 message: `Erro ao buscar pagamento ${id} da loja ${loja.LTR_CNPJ} na tray -> ${response.data.message}`
//             });
//             throw new Error(`Erro ao buscar pagamento ${id} da loja ${loja.LTR_CNPJ} na tray -> ${response.data.message}`);
//         }
//     } catch (error) {
//         logger.log({
//             level: 'error',
//             message: `Erro de conexão com API da TRAY -> ${error}`
//         });
//         throw new Error(`Erro de conexão com API da TRAY`);
//     }
// }
