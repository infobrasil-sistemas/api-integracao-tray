import axios from "axios";
import { ILojaTray } from "../../../../interfaces/ILojaTray";
import { IOrder } from "../../interfaces";

export async function getPedido(loja: ILojaTray, accessToken: string, id_pedido: number): Promise<IOrder | undefined> {
    try {
        const response: any = await axios.get(`${loja.LTR_API_HOST}/orders/${id_pedido}/complete`, {
            params: {
                access_token: accessToken
            }
        });
        const pedido = response.data.Order;
        const {
            id,
            status,
            date,
            hour,
            partial_total,
            taxes,
            discount,
            shipment,
            shipment_value,
            store_note,
            customer_note,
            payment_method_rate,
            installment,
            delivery_time,
            payment_method,
            total,
            payment_date,
            interest,
            has_payment,
            has_invoice,
            Customer,
            ProductsSold,
        } = pedido;

        let formaPagamento = '';
        const metodoPagamentoLower = payment_method
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (metodoPagamentoLower.includes('pix')) {
            formaPagamento = 'PIX';
        } else if (metodoPagamentoLower.includes('transferencia')) {
            formaPagamento = 'TRANSFERENCIA';
        } else if (metodoPagamentoLower.includes('boleto')) {
            formaPagamento = 'BOLETO';
        } else if (metodoPagamentoLower.includes('cartao')) {
            formaPagamento = 'CARTAO';
        }
        else {
            throw new Error(`Impossivel integrar pedido ${id} da loja ${loja.LTR_NOME} -> Forma de pagamento ausente ou inválida: ${metodoPagamentoLower} / ${payment_method}`);
        }

        return {
            id: parseInt(id),
            status,
            date: date,
            hour,
            partial_total: parseFloat(partial_total),
            taxes: parseFloat(taxes),
            discount: parseFloat(discount),
            shipment,
            shipment_value: parseFloat(shipment_value),
            store_note,
            customer_note,
            payment_method_rate: parseFloat(payment_method_rate),
            installment: parseInt(installment),
            delivery_time,
            payment_method: formaPagamento,
            total: parseFloat(total),
            payment_date: payment_date,
            interest: parseFloat(interest),
            has_payment: Boolean(parseInt(has_payment)),
            has_invoice: Boolean(parseInt(has_invoice)),
            Customer: {
                id: parseInt(Customer.id),
                cpf: Customer.cpf || undefined, // Adicionado fallback para undefined
                cnpj: Customer.cnpj || undefined,
                rg: Customer.rg || undefined,
                name: Customer.name,
                phone: Customer.phone || undefined, // Tornado opcional, conforme a interface
                cellphone: Customer.cellphone || undefined,
                birth_date: Customer.birth_date !== '0000-00-00' ? Customer.birth_date : undefined,
                gender: parseInt(Customer.gender),
                email: Customer.email,
                nickname: Customer.nickname || undefined,
                observation: Customer.observation || undefined, // Adicionado fallback para undefined
                type: parseInt(Customer.type),
                company_name: Customer.company_name || undefined,
                state_inscription: Customer.state_inscription || undefined,
                last_purchase: Customer.last_purchase ? Customer.last_purchase : undefined,
                address: Customer.address,
                zip_code: Customer.zip_code,
                number: Customer.number,
                complement: Customer.complement || undefined,
                neighborhood: Customer.neighborhood,
                city: Customer.city,
                state: Customer.state,
                country: Customer.country,
                CustomerAddresses: Customer.CustomerAddresses.map((address: any) => ({
                    id: address.CustomerAddress.id,
                    customer_id: address.CustomerAddresscustomer_id,
                    address: address.CustomerAddress.address,
                    number: address.CustomerAddress.number,
                    complement: address.CustomerAddress.complement,
                    neighborhood: address.CustomerAddress.neighborhood,
                    city: address.CustomerAddress.city,
                    state: address.CustomerAddress.state,
                    zip_code: address.CustomerAddress.zip_code,
                    country: address.CustomerAddress.country,
                    type: address.CustomerAddress.type
                }))
            },
            ProductsSold: ProductsSold.map((product: any) => ({
                product_id: parseInt(product.ProductsSold.product_id),
                quantity: parseInt(product.ProductsSold.quantity),
                id: parseInt(product.ProductsSold.id),
                price: parseFloat(product.ProductsSold.price),
                original_price: parseFloat(product.ProductsSold.original_price),
                variant_id: parseInt(product.ProductsSold.variant_id) || undefined,
            })),
            // Payment: Payment.map((payment: any) => ({
            //     id: parseInt(payment.Payment.id),
            //     payment_method_id: parseInt(payment.Payment.payment_method_id),
            //     method: payment.Payment.method,
            //     value: parseFloat(payment.Payment.value),
            // }))
        };

    } catch (error) {
        throw error;
    }
}
