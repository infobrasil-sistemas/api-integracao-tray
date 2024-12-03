import { Job } from 'bull';
import { MyJobs } from '.';
import { atualizarProdutos } from '../functions/produtos/atualizarProdutos';
import { cadastrarProdutos } from '../functions/produtos/cadastrarProdutos';
import { getLojaDbConfig } from '../services/lojas/consultas/getLojaDbConfig';
import { getLojasDadosTray } from '../services/lojas/consultas/getLojasDadosTray';
import { getLojaDatabaseConnection } from '../config/db/lojaDatabase';
import logger from '../utils/logger';
import { getApiDatabaseConnection } from '../config/db/database';
import { tratarTokens } from '../utils/tratarTokens';

export const SincronizarProdutos: MyJobs<null> = {
    key: 'SincronizarProdutos',
    options: {
        repeat: { cron: '*/15 * * * *' },
    },
    handle: async (job: Job<null>) => {
        logger.log({
            level: 'info',
            message: `Sincronizando produtos...`,
        });

        try {
            const apiConexao = await getApiDatabaseConnection();
            const lojas = await getLojasDadosTray(apiConexao);

            for (const loja of lojas) {
                let conexao: any;

                try {
                    const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO);
                    conexao = await getLojaDatabaseConnection(dadosConexao);
                    const accessToken = await tratarTokens(loja, apiConexao);

                    await atualizarProdutos(loja, conexao, accessToken);
                    await cadastrarProdutos(loja, conexao, accessToken);
                } catch (error) {
                    logger.log({
                        level: 'error',
                        message: `Erro ao executar rotina de sincronização de produtos para a loja ${loja.LTR_CNPJ} -> ${error}`,
                    });
                } finally {
                    if (conexao) {
                        conexao.detach();
                    }
                }
            }

            logger.log({
                level: 'info',
                message: `Produtos sincronizados com sucesso.`,
            });
        } catch (error) {
            logger.log({
                level: 'error',
                message: `Erro ao executar rotina de sincronização de produtos -> ${error}`,
            });
        }
    },
};
