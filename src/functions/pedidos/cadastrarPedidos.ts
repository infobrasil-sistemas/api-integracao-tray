import axios from "axios";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { atualizarFinanceiroPedido } from "../../services/pedidos/envios/atualizarFinanceiroPedido";
import { cadastrarPedido } from "../../services/pedidos/envios/cadastrarPedido";
import { cadastrarProdutoVendido } from "../../services/pedidos/envios/cadatrarProdutoVendido";
import { getPedidosAEnviar } from "../../services/pedidos/tray/consultas/getPedidosAEnviar";
import { atualizarStatusPedidoSincronizado } from "../../services/pedidos/tray/envios/atualizarStatusPedidoSincronizado";
import { getProdutoCodigoByIdTray } from "../../services/produtos/consultas/getProdutoCodigoByIdTray";
import { getProdutoGradeCodigosByIdTray } from "../../services/produtos/consultas/getProdutoGradeCodigosByIdTray";
import logger from "../../utils/logger";
import { upsertCliente } from "../clientes/upsertCliente";
import { getPedidoCompleto } from "./getPedidoCompleto";

export async function cadastrarPedidos(loja: ILojaTray, conexao: any, access_token: string) {
    try {
        const idPedidos = await getPedidosAEnviar(loja, access_token)

        if (idPedidos.length > 0) {
            for (const idPedido of idPedidos) {
                const pedido = await getPedidoCompleto(loja, access_token, idPedido);

                if (pedido) {
                    const transaction: any = await new Promise((resolve, reject) => {
                        conexao.startTransaction((err: any, transaction: any) => {
                            if (err) {
                                logger.log({
                                    level: 'error',
                                    message: `Erro ao iniciar transação no banco da loja ${loja.LTR_CNPJ}: ${err}`
                                });
                                return reject(err);
                            }
                            resolve(transaction);
                        });
                    });

                    try {
                        // logger.log({
                        //     level: 'error',
                        //     message: JSON.stringify(pedido.Customer)
                        // });
                        const cli_codigo = await upsertCliente(loja, transaction, pedido.Customer)
                        const ven_numero = await cadastrarPedido(loja, transaction, pedido, cli_codigo)
                        for (const produtoVendido of pedido.ProductsSold) {
                            if (produtoVendido.variant_id) {
                                const nossoProduto = await getProdutoGradeCodigosByIdTray(loja, transaction, produtoVendido.variant_id)
                                await cadastrarProdutoVendido(loja, transaction, produtoVendido, nossoProduto, ven_numero)
                            } else {
                                const nossoProduto = await getProdutoCodigoByIdTray(loja, transaction, produtoVendido.product_id)
                                await cadastrarProdutoVendido(loja, transaction, produtoVendido, nossoProduto, ven_numero)
                            }
                        }
                        await atualizarFinanceiroPedido(loja, transaction, pedido, ven_numero)
                        await atualizarStatusPedidoSincronizado(loja, access_token, pedido.id)

                        await new Promise((resolve, reject) => {
                            transaction.commit((err: any) => {
                                if (err) {
                                    transaction.rollback();
                                    reject(`Erro ao fazer commit do pedido ${pedido.id} da loja ${loja.LTR_CNPJ}: ${err}`);
                                }
                                resolve(true);
                            });
                        });

                    } catch (error) {
                        transaction.rollback();
                        logger.log({
                            level: 'error',
                            message: `Erro ao sincronizar pedido ${pedido.id} da loja ${loja.LTR_CNPJ} -> ${error}`
                        });
                    }
                }
            }
            logger.log({
                level: 'info',
                message: `Pedidos da loja ${loja.LTR_CNPJ} sincronizados com sucesso!`
            });
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            logger.log({
                level: 'error',
                message: `Erro na rotina cadastrar pedidos da loja ${loja.LTR_CNPJ} -> 
                Status: ${error.response?.status || 'Sem status'} 
                Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                Endpoint: ${error.response?.data.url || ''}`
            });
        } else {
            logger.log({
                level: 'error',
                message: `Erro inesperado na rotina cadastrar pedidos da loja ${loja.LTR_CNPJ} -> ${error.message}`
            });
        }
    }
}

