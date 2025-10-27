import { ILojaTray } from "../../interfaces/ILojaTray";
import { getCodigoCliente } from "../../services/clientes/consultas/getCodigoCliente";
import { getMunCodigoByCityName } from "../../services/clientes/consultas/getMunCodigoByCityName";
import { atualizarCliente } from "../../services/clientes/envios/atualizarCliente";
import { cadastrarCliente } from "../../services/clientes/envios/cadastrarCliente";
import { ICustomerAddress, ICustomerWithDeliveryAddress } from "../../services/pedidos/interfaces";
import logger from "../../utils/logger";

export async function upsertCliente(loja: ILojaTray, transaction: any, cliente: ICustomerWithDeliveryAddress): Promise<number> {
    try {
        const documento = cliente.cpf ? cliente.cpf : cliente.cnpj

        const clienteCodigo = await getCodigoCliente(loja, transaction, cliente.id, documento!)

        let munCodigo: number | null = null
        let endereco: ICustomerAddress | null = null
        let munCodigoEnt: number | null = null
        let enderecoEnt: ICustomerAddress | null = null

        if (cliente.CustomerAddresses.length > 0) {
            for (const address of cliente.CustomerAddresses) {

                if (!address.city) {
                    throw new Error(`Cliente ${cliente.id} sem Cidade/Municipio no endereço ${address.id}`);
                }

                const codigoMunicipio = await getMunCodigoByCityName(loja, transaction, address.city);

                if (!codigoMunicipio) {
                    throw new Error(`Município não encontrado para a cidade "${address.city}" ao processar o endereço ${address.id} do cliente ${cliente.id}`);
                }

                if (address.type === "0") {
                    munCodigo = codigoMunicipio;
                    endereco = address
                } else if (address.type === "1") {
                    munCodigoEnt = codigoMunicipio;
                    enderecoEnt = address
                }
            }

            if (munCodigoEnt && !munCodigo) {
                munCodigo = munCodigoEnt
                endereco = enderecoEnt
                munCodigoEnt = null
                enderecoEnt = null
            }
        }
        else {
            const codigoMunicipio = await getMunCodigoByCityName(loja, transaction, cliente.city);

            if (!codigoMunicipio) {
                throw new Error(`Município não encontrado para a cidade "${cliente.city}" ao processar o endereço do cliente ${cliente.id}`);
            }
            munCodigo = codigoMunicipio
            endereco = {
                address: cliente.address,
                number: cliente.number,
                complement: cliente.complement,
                neighborhood: cliente.neighborhood,
                city: cliente.city,
                state: cliente.state,
                zip_code: cliente.zip_code,
                country: cliente.country
            }
        }

        if (!munCodigo || !endereco) {
            throw new Error(`Erro ao obter dados de endereço do Cliente ${cliente.id}`);
        }

        const clienteComMunCodigo = {
            ...cliente,
            munCodigo,
            endereco,
            munCodigoEnt,
            enderecoEnt
        };

        if (clienteCodigo) {
            await atualizarCliente(loja, transaction, clienteComMunCodigo)
            return clienteCodigo
        }
        else {
            const clienteCodigo = await cadastrarCliente(loja, transaction, clienteComMunCodigo)
            return clienteCodigo
        }
    } catch (error) {
        throw error
    }
}
