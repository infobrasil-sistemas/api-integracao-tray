import { ILojaTray } from '../../../../interfaces/ILojaTray';
import logger from '../../../../utils/logger';
import axios from 'axios';
import { ICustomer } from '../../../pedidos/interfaces';
import dayjs from 'dayjs';

export async function getCliente(loja: ILojaTray, accessToken: string, id: number): Promise<ICustomer> {
    try {
        const response = await axios.get(`${loja.LTR_API_HOST}/customers/${id}`, {
            params: {
                access_token: accessToken
            }
        });

        if (response.status === 201 || response.status === 200) {
            const cliente = response.data.Customer;

            const {
                id,
                cpf,
                cnpj,
                rg,
                name,
                phone,
                cellphone,
                birth_date,
                gender,
                email,
                nickname,
                observation,
                type,
                company_name,
                state_inscription,
                last_purchase,
                address,
                zip_code,
                number,
                complement,
                neighborhood,
                city,
                state,
                country,
            } = cliente;


            return {
                id: parseInt(id),
                cpf: cpf || undefined,
                cnpj: cnpj || undefined,
                rg: rg || undefined,
                name: name,
                phone: phone || undefined,
                cellphone: cellphone || undefined,
                birth_date: birth_date ? dayjs(birth_date).toDate() : undefined,
                gender: parseInt(gender),
                email,
                nickname: nickname || undefined,
                observation: observation || undefined,
                type: parseInt(type),
                company_name: company_name || undefined,
                state_inscription: state_inscription || undefined,
                last_purchase: last_purchase ? dayjs(last_purchase).toDate() : undefined,
                address,
                zip_code,
                number,
                complement: complement || undefined,
                neighborhood,
                city,
                state,
                country,
            };
        } else {
            logger.log({
                level: 'error',
                message: `Erro ao buscar cliente ${id} da loja ${loja.LTR_NOME} na tray -> ${response.data.message}`
            });
            throw new Error(`Erro ao buscar produto ${id} da loja ${loja.LTR_NOME} na tray -> ${response.data.message}`);
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro de conexão com API da TRAY`
        });
        throw new Error(`Erro de conexão com API da TRAY`);
    }
}
