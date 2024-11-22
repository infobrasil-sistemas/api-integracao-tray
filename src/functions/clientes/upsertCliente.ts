import { ILojaTray } from "../../interfaces/ILojaTray";
import { getCodigoCliente } from "../../services/clientes/consultas/getCodigoCliente";
import { getMunCodigoByCityName } from "../../services/clientes/consultas/getMunCodigoByCityName";
import { atualizarCliente } from "../../services/clientes/envios/atualizarCliente";
import { cadastrarCliente } from "../../services/clientes/envios/cadastrarCliente";
import { ICustomer } from "../../services/pedidos/interfaces";

export async function upsertCliente(loja: ILojaTray, transaction: any, cliente: ICustomer): Promise<number> {
    try {
        const documento = cliente.cpf ? cliente.cpf : cliente.cnpj
        const clienteCodigo = await getCodigoCliente(loja, transaction, cliente.id, documento!)
        const munCodigo = await getMunCodigoByCityName(loja, transaction, cliente.city)
        const clienteComMunCodigo = {
            ...cliente,
            munCodigo: munCodigo || 2304400
        }
        if (clienteCodigo) {
            await atualizarCliente(loja, transaction, clienteComMunCodigo)
            return clienteCodigo
        }
        else {
            return await cadastrarCliente(loja, transaction, clienteComMunCodigo)
        }
    } catch (error) {
        throw error
    }
}