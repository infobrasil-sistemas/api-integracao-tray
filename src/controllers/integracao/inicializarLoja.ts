import { Request, Response } from 'express';
import { z } from 'zod';
import logger from '../../utils/logger';
import { getApiDatabaseConnection } from '../../config/db/database';
import { IDadosEndereco, ILojaTray, ILojaTrayInicializada, ILojaTrayInicializar } from '../../interfaces/ILojaTray';
import axios from 'axios';
import { cadastrarStatusSincronizado } from '../../services/pedidos/tray/envios/cadastrarStatusSincronizado';
import { cadastrarLojaTray } from '../../services/lojas/envios/cadastrarLojaTray';
import { cadastrarCategorias } from '../../functions/categorias/cadastrarCategorias';
import { getLojaDatabaseConnection } from '../../config/db/lojaDatabase';
import { getLojaDbConfig } from '../../services/lojas/consultas/getLojaDbConfig';
import { cadastrarProdutos } from '../../functions/produtos/cadastrarProdutos';
import { cadastrarFormasPagamentoEcommerce } from '../../functions/integracao/cadastrarFormasPagamentoEcommerce';
import { ativarLojaTray } from '../../services/lojas/envios/ativarLojaTray';
import { cadastrarDadosEndereco } from '../../services/lojas/envios/cadastrarDadosEndereco';

interface IOperacoes {
    dados_endereco: null | 'SUCESSO'
    gerar_tokens: null | 'SUCESSO',
    status_sincronizado: null | 'SUCESSO',
    loja: null | 'SUCESSO',
    categorias: null | 'SUCESSO',
    produtos: null | 'SUCESSO',
    fpgs_ecommerce: null | 'SUCESSO',
    ativar_loja: null | 'SUCESSO'
}

const inicializarLojaSchema = z.object({
    DAD_HOST: z.string().min(1),
    DAD_PORTA: z.number().min(1).max(65535, "O campo 'DAD_PORTA' deve ser um número válido para portas."),
    DAD_USER: z.string().min(1),
    DAD_CAMINHO: z.string().min(1),
    DAD_CNPJ: z.string().regex(/^\d{14}$/, "O campo 'DAD_CNPJ' deve conter exatamente 14 dígitos."),
    DAD_ID: z.string().min(1),
    LTR_CONSUMER_KEY: z.string().min(1),
    LTR_CONSUMER_SECRET: z.string().min(1),
    LTR_CODE: z.string().min(1),
    LTR_STORE_ID: z.number(),
    LTR_CNPJ: z.string().length(14),
    LTR_LOJAS_ESTOQUE: z.string(),
    LOJ_CODIGO: z.number(),
    LTR_TABELA_PRECO: z
        .number()
        .int(), // Garante que é um número inteiro
    LTR_TIPO_ESTOQUE: z.number(),
    LTR_INTERMEDIADOR_PAGAMENTO: z.string().optional(),
    LTR_ESTOQUE_MINIMO: z.number(),
    LTR_SINCRONIZA_ALTERACOES: z.string(),
    USU_CODIGO: z.number().nullish(),
    LTR_SINCRONIZA_PROMOCOES: z.string()
});

export async function inicializarLoja(req: Request, res: Response) {
    let conexaoApi;
    let conexaoLoja;

    const operacoes: IOperacoes = {
        dados_endereco: null,
        gerar_tokens: null,
        status_sincronizado: null,
        loja: null,
        categorias: null,
        produtos: null,
        fpgs_ecommerce: null,
        ativar_loja: null
    };

    try {
        const result = inicializarLojaSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }

        const data = result.data;

        conexaoApi = await getApiDatabaseConnection()

        const dadosEndereco: IDadosEndereco = {
            DAD_HOST: data.DAD_HOST,
            DAD_PORTA: data.DAD_PORTA,
            DAD_USER: data.DAD_USER,
            DAD_CAMINHO: data.DAD_CAMINHO,
            DAD_CNPJ: data.DAD_CNPJ,
            DAD_ID: data.DAD_ID
        }

        const DAD_CODIGO = await cadastrarDadosEndereco(dadosEndereco, conexaoApi)
        operacoes.dados_endereco = 'SUCESSO'

        const loja: ILojaTrayInicializar = {
            LTR_CONSUMER_KEY: data.LTR_CONSUMER_KEY,
            LTR_CONSUMER_SECRET: data.LTR_CONSUMER_SECRET,
            LTR_CODE: data.LTR_CODE,
            LTR_API_HOST: `https://${data.LTR_STORE_ID}.commercesuite.com.br/web_api`,
            LTR_STORE_ID: data.LTR_STORE_ID,
            LTR_CNPJ: data.LTR_CNPJ,
            LTR_LOJAS_ESTOQUE: data.LTR_LOJAS_ESTOQUE,
            LTR_TIPO_ESTOQUE: data.LTR_TIPO_ESTOQUE,
            LTR_ESTOQUE_MINIMO: data.LTR_ESTOQUE_MINIMO,
            LOJ_CODIGO: data.LOJ_CODIGO,
            LTR_TABELA_PRECO: data.LTR_TABELA_PRECO,
            LTR_INTERMEDIADOR_PAGAMENTO: data.LTR_INTERMEDIADOR_PAGAMENTO || undefined,
            DAD_CODIGO: DAD_CODIGO,
            LTR_SINCRONIZA_ALTERACOES: data.LTR_SINCRONIZA_ALTERACOES,
            USU_CODIGO: data.USU_CODIGO || undefined,
            LTR_SINCRONIZA_PROMOCOES: data.LTR_SINCRONIZA_PROMOCOES
        }

        const requestBody = {
            consumer_key: loja.LTR_CONSUMER_KEY,
            consumer_secret: loja.LTR_CONSUMER_SECRET,
            code: loja.LTR_CODE
        };

        const tokensResponse = await axios.post(`${loja.LTR_API_HOST}/auth`, requestBody);
        operacoes.gerar_tokens = 'SUCESSO'

        const dadosTokens = {
            access_token: tokensResponse.data.access_token,
            refresh_token: tokensResponse.data.refresh_token,
            data_expiration_access_token: tokensResponse.data.date_expiration_access_token,
            data_expiration_refresh_token: tokensResponse.data.date_expiration_refresh_token
        }

        const statusSincronizadoId = await cadastrarStatusSincronizado(loja, dadosTokens.access_token)
        operacoes.status_sincronizado = 'SUCESSO'

        const lojaInicializada: ILojaTrayInicializada = {
            ...loja,
            LTR_ACCESS_TOKEN: dadosTokens.access_token,
            LTR_REFRESH_TOKEN: dadosTokens.refresh_token,
            LTR_EXPIRATION_ACCESS_TOKEN: dadosTokens.data_expiration_access_token,
            LTR_EXPIRATION_REFRESH_TOKEN: dadosTokens.data_expiration_refresh_token,
            LTR_ID_STATUS_SINCRONIZADO: statusSincronizadoId,
        }

        const LTR_CODIGO = await cadastrarLojaTray(lojaInicializada, conexaoApi)
        operacoes.loja = 'SUCESSO'


        const lojaCadastrada: ILojaTray = {
            ...lojaInicializada,
            LTR_CODIGO
        }

        const dadosConexao = await getLojaDbConfig(lojaInicializada.DAD_CODIGO)
        conexaoLoja = await getLojaDatabaseConnection(dadosConexao);

        await cadastrarCategorias(lojaCadastrada, conexaoLoja, lojaCadastrada.LTR_ACCESS_TOKEN)
        operacoes.categorias = 'SUCESSO'

        await cadastrarProdutos(lojaCadastrada, conexaoLoja, lojaCadastrada.LTR_ACCESS_TOKEN)
        operacoes.produtos = 'SUCESSO'

        await cadastrarFormasPagamentoEcommerce(lojaCadastrada, conexaoLoja)
        operacoes.fpgs_ecommerce = 'SUCESSO'


        await ativarLojaTray(lojaCadastrada, conexaoApi)
        operacoes.ativar_loja = 'SUCESSO'

        return res.status(201).json(operacoes);

    } catch (error: any) {
        logger.log({
            level: 'error',
            message: `Erro ao inicializar loja -> ${error}`,
        });
        return res.status(500).json({ error: `Erro ao inicializar loja. -> ${error}`, operacoes: operacoes });
    } finally {
        if (conexaoApi) conexaoApi.detach();
        if (conexaoLoja) conexaoLoja.detach();
    }
}
