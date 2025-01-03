import { ILojaTray } from '../../interfaces/ILojaTray';
import logger from '../../utils/logger';

export async function cadastrarFormasPagamentoEcommerce(loja: ILojaTray, conexao: any): Promise<void> {
    try {
        const formasPagamento = [
            {
                FPG_CODIGO: 9999,
                FPG_DESCRICAO: 'CARTAO ECOMMERCE',
                FPG_GERARRECLIQ: 'N',
                FPG_CODIGORES: '4',
                FPG_DESCONTO: 0,
                FPG_COMISSAO: 0,
                FPG_DIASVENCIMENTO: 0,
                FPG_COBRANCA: 'N',
                FPG_CARNE: 'N',
                FPG_TAXAADM: 0,
                FPG_ACRESCFINANCEIRO: 0,
                FPG_TOTALIZAR_CAIXA: 'N',
                FPG_TIPO: 'C',
                FPG_SITUACAO: 'A',
                FPG_SALDOTESOURARIA: 'N',
                FPG_BAIXACOMDESCONTO: 'N',
                FPG_QTDEMAXPARCELA: null,
                USU_CODIGO: 1,
                FPG_DATAALTERACAO: '2022-09-12',
                FPG_HORAALTERACAO: '09:29:18',
                CRE_CODIGO: null,
                FPG_DESCRICAO_ECF: 'CARTAO',
                FPG_TEF: 'S',
                FPG_BANDEIRA: null,
                ITG_CODIGO: null,
                FPG_DESCONTOVENDA: 0,
                BAC_CODIGO: null,
                CLI_CODIGO: null,
                FPG_APROVACAO: 'N',
                FPG_DESCONTOFINANCEIRO: null,
                FPG_CARTAOPROPRIO: 'N',
                EVC_CODIGO: null,
                PAR_CODIGO: null,
                FPG_MENSAGEMDEBAIXA: null,
                BAN_CONTA: null,
                ADC_CODIGO: null,
                BCN_CODIGO: null,
                FPG_QTDEMINPARCELA: null,
                FPG_CODIGOCONTABIL: null,
                IPR_CODIGO: null,
                FPG_MOBILE: 'S',
                FPG_DESCRICAOFORMAPAGSITE: null,
                CMP_CODIGO: null,
                FPG_PIX: 'N',
                FPG_INTEGRACAOFINANCEIRA: 'S',
                FPG_TABPRECOVENDA: null
            },
            {
                FPG_CODIGO: 9998,
                FPG_DESCRICAO: 'PIX ECOMMERCE',
                FPG_GERARRECLIQ: 'N',
                FPG_CODIGORES: '0',
                FPG_DESCONTO: 0,
                FPG_COMISSAO: 1,
                FPG_DIASVENCIMENTO: 30,
                FPG_COBRANCA: 'N',
                FPG_CARNE: 'N',
                FPG_TAXAADM: 0,
                FPG_ACRESCFINANCEIRO: 0,
                FPG_TOTALIZAR_CAIXA: 'S',
                FPG_TIPO: 'O',
                FPG_SITUACAO: 'A',
                FPG_SALDOTESOURARIA: 'N',
                FPG_BAIXACOMDESCONTO: 'N',
                FPG_QTDEMAXPARCELA: null,
                USU_CODIGO: 1,
                FPG_DATAALTERACAO: '2024-07-25',
                FPG_HORAALTERACAO: '11:29:32',
                CRE_CODIGO: null,
                FPG_DESCRICAO_ECF: null,
                FPG_TEF: 'N',
                FPG_BANDEIRA: null,
                ITG_CODIGO: null,
                FPG_DESCONTOVENDA: 0,
                BAC_CODIGO: null,
                CLI_CODIGO: null,
                FPG_APROVACAO: 'N',
                FPG_DESCONTOFINANCEIRO: 0,
                FPG_CARTAOPROPRIO: 'N',
                EVC_CODIGO: null,
                PAR_CODIGO: null,
                FPG_MENSAGEMDEBAIXA: '1010',
                BAN_CONTA: null,
                ADC_CODIGO: 25,
                BCN_CODIGO: null,
                FPG_QTDEMINPARCELA: null,
                FPG_CODIGOCONTABIL: null,
                IPR_CODIGO: null,
                FPG_MOBILE: 'N',
                FPG_DESCRICAOFORMAPAGSITE: null,
                CMP_CODIGO: 17,
                FPG_PIX: 'S',
                FPG_INTEGRACAOFINANCEIRA: null,
                FPG_TABPRECOVENDA: null
            },
            {
                FPG_CODIGO: 9997,
                FPG_DESCRICAO: 'BOLETO ECOMMERCE',
                FPG_GERARRECLIQ: 'N',
                FPG_CODIGORES: '6',
                FPG_DESCONTO: null,
                FPG_COMISSAO: null,
                FPG_DIASVENCIMENTO: null,
                FPG_COBRANCA: null,
                FPG_CARNE: null,
                FPG_TAXAADM: null,
                FPG_ACRESCFINANCEIRO: null,
                FPG_TOTALIZAR_CAIXA: 'N',
                FPG_TIPO: 'O',
                FPG_SITUACAO: null,
                FPG_SALDOTESOURARIA: 'N',
                FPG_BAIXACOMDESCONTO: 'N',
                FPG_QTDEMAXPARCELA: null,
                USU_CODIGO: 1,
                FPG_DATAALTERACAO: '2020-09-16',
                FPG_HORAALTERACAO: '11:49:38',
                CRE_CODIGO: null,
                FPG_DESCRICAO_ECF: null,
                FPG_TEF: 'N',
                FPG_BANDEIRA: null,
                ITG_CODIGO: null,
                FPG_DESCONTOVENDA: null,
                BAC_CODIGO: null,
                CLI_CODIGO: null,
                FPG_APROVACAO: 'N',
                FPG_DESCONTOFINANCEIRO: null,
                FPG_CARTAOPROPRIO: 'N',
                EVC_CODIGO: null,
                PAR_CODIGO: null,
                FPG_MENSAGEMDEBAIXA: null,
                BAN_CONTA: null,
                ADC_CODIGO: null,
                BCN_CODIGO: null,
                FPG_QTDEMINPARCELA: null,
                FPG_CODIGOCONTABIL: null,
                IPR_CODIGO: null,
                FPG_MOBILE: 'S',
                FPG_DESCRICAOFORMAPAGSITE: null,
                CMP_CODIGO: null,
                FPG_PIX: 'N',
                FPG_INTEGRACAOFINANCEIRA: 'N',
                FPG_TABPRECOVENDA: null
            }
        ];

        // Loop para inserir os registros individualmente
        for (const formaPagamento of formasPagamento) {
            const insertQuery = `
                INSERT INTO FORMASPAG 
                (${Object.keys(formaPagamento).join(', ')})
                VALUES 
                (${Object.keys(formaPagamento).map(() => '?').join(', ')})
            `;

            await new Promise((resolve, reject) => {
                conexao.query(insertQuery, Object.values(formaPagamento), (err: any) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });
        }

        logger.log({
            level: 'info',
            message: `Formas de pagamento ecommerce cadastradas com sucesso na loja ${loja.LTR_CNPJ}`
        });

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar formas de pagamento ecommerce na loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}
