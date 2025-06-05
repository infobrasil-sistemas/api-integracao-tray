import dayjs from 'dayjs';
import { ILojaTray } from '../../../interfaces/ILojaTray';
import { ICustomerComMunCodigo } from '../../pedidos/interfaces';

export async function cadastrarCliente(loja: ILojaTray, transaction: any, cliente: ICustomerComMunCodigo): Promise<number> {
    try {
        const clienteInsert: any = {
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

            // Endereço principal - vindo de cliente.endereco
            cli_endereco: cliente.endereco?.address?.slice(0, 120) || null,
            cli_cep: cliente.endereco?.zip_code?.replace(/\D/g, '').slice(0, 9) || null,
            cli_numero: cliente.endereco?.number?.slice(0, 6) || null,
            cli_compl_endereco: cliente.endereco?.complement ? cliente.endereco.complement.slice(0, 40) : null,
            cli_bairro: cliente.endereco?.neighborhood?.slice(0, 40) || null,
            cli_uf: cliente.endereco?.state?.slice(0, 2) || 'CE',
            mun_codigo: cliente.munCodigo,

            cli_end_mesmo_ent: 'S',
            cli_veioloja: 'I' // SITE LOJA

        };

        // Se o endereço de entrega existir, adiciona ao objeto
        if (cliente.enderecoEnt) {
            clienteInsert.cli_endereco_ent = cliente.enderecoEnt?.address?.slice(0, 120) || null;
            clienteInsert.cli_cep_ent = cliente.enderecoEnt?.zip_code?.replace(/\D/g, '').slice(0, 9) || null;
            clienteInsert.cli_numero_ent = cliente.enderecoEnt?.number?.slice(0, 6) || null;
            clienteInsert.cli_compl_endereco_ent = cliente.enderecoEnt?.complement ? cliente.enderecoEnt.complement.slice(0, 40) : null;
            clienteInsert.cli_bairro_ent = cliente.enderecoEnt?.neighborhood?.slice(0, 40) || null;
            clienteInsert.cli_uf_ent = cliente.enderecoEnt?.state?.slice(0, 2) || 'CE';
            clienteInsert.mun_codent = cliente.munCodigoEnt;
            clienteInsert.cli_end_mesmo_ent = 'N'
        }

        const cli_codigo = 'GEN_ID(GEN_CODIGOCLI, 1)';

        // Monta a query dinamicamente
        const campos = Object.keys(clienteInsert);
        const placeholders = campos.map(() => '?').join(', ');

        const query = `
            INSERT INTO CLIENTES
            (cli_codigo, ${campos.join(', ')})
            VALUES (${cli_codigo}, ${placeholders})
            RETURNING CLI_CODIGO
        `;

        const values = Object.values(clienteInsert);

        return new Promise((resolve, reject) => {
            transaction.query(query, values, (err: any, result: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.CLI_CODIGO);
            });
        });
    } catch (error) {
        throw new Error(`Erro ao inserir cliente ${cliente.id} na loja ${loja.LTR_CNPJ} -> ${error}`);
    }
}
