import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { ICustomerAddress } from '../../../pedidos/interfaces';

export async function getEndereco(loja: ILojaTray, accessToken: string, id: number): Promise<ICustomerAddress> {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/customers/addresses/${id}`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            const endereco = response.data.CustomerAddress;

            const {
                id,
                customer_id,
                address,
                number,
                complement,
                neighborhood,
                city,
                state,
                zip_code,
                country,
                type
            } = endereco;

            return {
                id: parseInt(id),
                customer_id: parseInt(customer_id),
                address,
                number,
                complement: complement || undefined,
                neighborhood,
                city,
                state,
                zip_code,
                country,
                type
            };
        } else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar endereço ${id} da loja ${loja.LTR_NOME} na tray -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar endereço ${id} da loja ${loja.LTR_NOME} na tray -> ${response.data.message}`);
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY -> ${error}`
        });
        throw new Error(`Erro de conexão com API da TRAY`);
    }
}
