import axios from "axios";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getSecoesIntegradas } from "../../../services/categorias/consultas/getSecoesIntegradas";
import { atualizarCategoria } from "../../../services/categorias/tray/envios/atualizarCategoria";
import logger from "../../../utils/logger";

export async function atualizarSecoes(loja: ILojaTray, conexao: any, accessToken: string) {
    try {
        const secoesIntegradas = await getSecoesIntegradas(loja.LTR_CNPJ, conexao)
        for (const secaoIntegrada of secoesIntegradas) {
            try {
                const secaoAtualizada = {
                    name: secaoIntegrada.name,
                    // slug: secaoIntegrada.name,
                    title: secaoIntegrada.name,
                    small_description: secaoIntegrada.name,
                }
                await atualizarCategoria(loja, accessToken, secaoAtualizada, secaoIntegrada.id)
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    logger.log({
                        level: 'error',
                        message: `Erro ao atualizar a seção ${secaoIntegrada.name} da loja ${loja.LTR_NOME} -> 
                        Status: ${error.response?.status || 'Sem status'} 
                        Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                        Endpoint: ${error.response?.data.url || ''}`
                    });
                } else {
                    logger.log({
                        level: 'error',
                        message: `Erro inesperado ao atualizar a seção ${secaoIntegrada.name} da loja ${loja.LTR_NOME} -> ${error.message}`
                    });
                }
            }
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar seções da loja ${loja.LTR_NOME} -> ${error}`
        });
    }

}