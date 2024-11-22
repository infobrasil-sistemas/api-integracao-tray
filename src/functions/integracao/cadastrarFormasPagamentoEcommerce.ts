import { ILojaTray } from '../../interfaces/ILojaTray';
import logger from '../../utils/logger';

export async function cadastrarFormasPagamentoEcommerce(loja: ILojaTray, conexao: any): Promise<void> {
    try {

        const insertQuery = `
                INSERT INTO FORMASPAG 
                    (FPG_CODIGO, FPG_DESCRICAO, FPG_GERARRECLIQ, FPG_CODIGORES, FPG_DESCONTO, FPG_COMISSAO, FPG_DIASVENCIMENTO, FPG_COBRANCA, FPG_CARNE, FPG_TAXAADM, FPG_ACRESCFINANCEIRO, FPG_TOTALIZAR_CAIXA, FPG_TIPO, FPG_SITUACAO, FPG_SALDOTESOURARIA, FPG_BAIXACOMDESCONTO, FPG_QTDEMAXPARCELA, USU_CODIGO, FPG_DATAALTERACAO, FPG_HORAALTERACAO, CRE_CODIGO, FPG_DESCRICAO_ECF, FPG_TEF, FPG_BANDEIRA, ITG_CODIGO, FPG_DESCONTOVENDA, BAC_CODIGO, CLI_CODIGO, FPG_APROVACAO, FPG_DESCONTOFINANCEIRO, FPG_CARTAOPROPRIO, EVC_CODIGO, PAR_CODIGO, FPG_MENSAGEMDEBAIXA, BAN_CONTA, ADC_CODIGO, BCN_CODIGO, FPG_QTDEMINPARCELA, FPG_CODIGOCONTABIL, IPR_CODIGO, FPG_MOBILE, FPG_DESCRICAOFORMAPAGSITE, CMP_CODIGO, FPG_PIX, FPG_INTEGRACAOFINANCEIRA, FPG_TABPRECOVENDA, FPG_ID_ECOMMERCE) 
                VALUES 
                    (9999, 'CARTAO ECOMMERCE', 'N', '4', 0, 0, 0, 'N', 'N', 0, 0, 'N', 'C', 'A', 'N', 'N', NULL, 1, '2022-09-12', '09:29:18', NULL, 'CARTAO', 'S', NULL, NULL, 0, NULL, NULL, 'N', NULL, 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'S', NULL, NULL, 'N', 'S', NULL, NULL),
                    (9998, 'PIX ECOMMERCE', 'N', '0', 0, 1, 30, 'N', 'N', 0, 0, 'S', 'O', 'A', 'N', 'N', NULL, 1, '2024-07-25', '11:29:32', 180, NULL, 'N', NULL, NULL, 0, NULL, NULL, 'N', 0, 'N', NULL, NULL, NULL, '1010', 25, NULL, NULL, 17, NULL, 'N', NULL, 17, 'S', NULL, NULL, NULL),
                    (9997, 'BOLETO ECOMMERCE', 'N', '6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', 'O', NULL, 'N', 'N', NULL, 1, '2020-09-16', '11:49:38', NULL, NULL, 'N', NULL, NULL, NULL, NULL, NULL, 'N', NULL, 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'S', NULL, NULL, 'N', NULL, NULL, NULL);

            `;


        await new Promise((resolve, reject) => {
            conexao.query(insertQuery, [], (err: any) => {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });

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