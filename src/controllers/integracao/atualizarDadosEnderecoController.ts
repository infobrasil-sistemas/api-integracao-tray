import { Request, Response } from 'express';
import { z } from 'zod';
import logger from '../../utils/logger';
import { getApiDatabaseConnection } from '../../config/db/database';
import { atualizarDadosEndereco } from '../../services/lojas/envios/atualizarDadosEndereço';

export const atualizarDadosEnderecoSchema = z.object({
    DAD_HOST: z.string().optional(),
    DAD_PORTA: z.number().max(65535, "O campo 'DAD_PORTA' deve ser um número válido para portas.").optional(),
    DAD_USER: z.string().optional(),
    DAD_CAMINHO: z.string().optional(),
    DAD_CNPJ: z.string().regex(/^\d{14}$/, "O campo 'DAD_CNPJ' deve conter exatamente 14 dígitos."),
    DAD_ID: z.string().optional(),
});

export async function atualizarDadosEnderecoController(req: Request, res: Response) {
    let conexaoApi;
    try {
        const result = atualizarDadosEnderecoSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }
        const data = result.data;

        conexaoApi = await getApiDatabaseConnection()

        await atualizarDadosEndereco(data, conexaoApi)

        return res.status(200).json({ message: 'Dados de endereço atualizados com sucesso.' });

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar dados endereço -> ${error}`,
        });
        return res.status(500).json({ error: `Erro ao atualizar dados endereço -> ${error}` });
    } finally {
        if (conexaoApi) {
            conexaoApi.detach();
        }
    }
}
