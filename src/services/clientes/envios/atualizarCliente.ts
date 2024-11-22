import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { ICustomerComMunCodigo } from '../../pedidos/interfaces';

export async function atualizarCliente(loja: ILojaTray, transaction: any, cliente: ICustomerComMunCodigo): Promise<void> {
    try {
        const clienteUpdate = {
            loj_codigo: loja.LOJ_CODIGO,
            cli_id_ecommerce: cliente.id,

            cli_cpf_cnpj: cliente.type == 0
                ? cliente.cpf ? cliente.cpf.replace(/\D/g, '').slice(0, 14) : null
                : cliente.cnpj ? cliente.cnpj.replace(/\D/g, '').slice(0, 14) : null,

            cli_identidade: cliente.type == 0
                ? cliente.rg ? cliente.rg.replace(/\D/g, '').slice(0, 40) : null
                : cliente.state_inscription ? cliente.state_inscription.replace(/\D/g, '').slice(0, 40) : null,

            cli_nome: cliente.type == 0
                ? cliente.name.slice(0, 60)
                : (cliente.company_name ? cliente.company_name.slice(0, 60) : cliente.name.slice(0, 60)),

            cli_fone: cliente.phone ? cliente.phone.replace(/\D/g, '').slice(0, 12) : null,
            cli_celular: cliente.cellphone ? cliente.cellphone.replace(/\D/g, '').slice(0, 12) : null,

            cli_datanasc: cliente.birth_date && dayjs(cliente.birth_date).isValid()
                ? dayjs(cliente.birth_date).format('YYYY-MM-DD')  
                : null, 

            cli_sexo: cliente.gender == 0 ? 'M' : 'F',
            cli_email: cliente.email.slice(0, 200) || null,
            cli_fantasia: cliente.nickname ? cliente.nickname.slice(0, 40) : null,
            cli_obs: cliente.observation || null,
            cli_tipo: cliente.type == 0 ? 'F' : 'J',
            cli_endereco: cliente.address.slice(0, 120) || null,
            cli_cep: cliente.zip_code.replace(/\D/g, '').slice(0, 9) || null,
            cli_numero: cliente.number.slice(0, 6) || null,
            cli_compl_endereco: cliente.complement ? cliente.complement.slice(0, 40) : null,
            cli_bairro: cliente.neighborhood.slice(0, 40) || null,
            cli_uf: cliente.state.slice(0, 2) || 'CE',
            mun_codigo: cliente.munCodigo,
        };

        const query = `
            UPDATE CLIENTES SET
                loj_codigo = ?,
                cli_id_ecommerce = ?,
                cli_cpf_cnpj = ?,
                cli_identidade = ?,
                cli_nome = ?,
                cli_fone = ?,
                cli_celular = ?,
                cli_datanasc = ?,
                cli_sexo = ?,
                cli_email = ?,
                cli_fantasia = ?,
                cli_obs = ?,
                cli_tipo = ?,
                cli_endereco = ?,
                cli_cep = ?,
                cli_numero = ?,
                cli_compl_endereco = ?,
                cli_bairro = ?,
                cli_uf = ?,
                mun_codigo = ?
            WHERE cli_id_ecommerce = ?
        `;

        const values = [
            clienteUpdate.loj_codigo,
            clienteUpdate.cli_id_ecommerce,
            clienteUpdate.cli_cpf_cnpj,
            clienteUpdate.cli_identidade,
            clienteUpdate.cli_nome,
            clienteUpdate.cli_fone,
            clienteUpdate.cli_celular,
            clienteUpdate.cli_datanasc,
            clienteUpdate.cli_sexo,
            clienteUpdate.cli_email,
            clienteUpdate.cli_fantasia,
            clienteUpdate.cli_obs,
            clienteUpdate.cli_tipo,
            clienteUpdate.cli_endereco,
            clienteUpdate.cli_cep,
            clienteUpdate.cli_numero,
            clienteUpdate.cli_compl_endereco,
            clienteUpdate.cli_bairro,
            clienteUpdate.cli_uf,
            clienteUpdate.mun_codigo,
            clienteUpdate.cli_id_ecommerce
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
        throw new Error(`Erro ao atualizar cliente ${cliente.id} na loja ${loja.LTR_CNPJ} -> ${error}`);
    }
}
