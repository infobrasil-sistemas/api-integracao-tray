import { Request, Response } from 'express';
import { z } from 'zod';
import logger from '../../utils/logger';
import { getApiDatabaseConnection } from '../../config/db/database';
import { atualizarLojaTray } from '../../services/lojas/envios/atualizarLojaTray';

export const atualizarLojaSchema = z.object({
    LTR_CONSUMER_KEY: z.string().optional(),
    LTR_CONSUMER_SECRET: z.string().optional(),
    LTR_CODE: z.string().optional(),
    LTR_API_HOST: z.string().optional(),
    LTR_STORE_ID: z.number().optional(),
    LTR_CNPJ: z.string().length(14).optional(),
    LTR_LOJAS_ESTOQUE: z.string().optional(),
    LTR_TIPO_ESTOQUE: z.number().optional(),
    LOJ_CODIGO: z.number().optional(),
    LTR_TABELA_PRECO: z.number().optional(),
    LTR_ID_STATUS_SINCRONIZADO: z.number().optional(),
    LTR_INTERMEDIADOR_PAGAMENTO: z.string().optional(),
    LTR_SITUACAO: z.string().optional(),
    LTR_ESTOQUE_MINIMO: z.number().optional()
});


export async function atualizarLoja(req: Request, res: Response) {
    let conexaoApi;
    try {
        const result = atualizarLojaSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }
        const data = result.data;

        conexaoApi = await getApiDatabaseConnection()

        await atualizarLojaTray(data, conexaoApi)

        return res.status(200).json({ message: 'Loja atualizada com sucesso.' });

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao inicializar loja -> ${error}`,
        });
        return res.status(500).json({ error: `Erro ao atualizar loja. -> ${error}` });
    } finally {
        if (conexaoApi) {
            conexaoApi.detach();
        }
    }
}
