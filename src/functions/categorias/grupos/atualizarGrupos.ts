import axios from "axios";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getGruposIntegrados } from "../../../services/categorias/consultas/getGruposIntegrados";
import { atualizarCategoria } from "../../../services/categorias/tray/envios/atualizarCategoria";
import logger from "../../../utils/logger";


export async function atualizarGrupos(loja: ILojaTray, conexao: any, accessToken: string) {
    try {
        const gruposIntegrados = await getGruposIntegrados(loja.LTR_CNPJ, conexao)
        for (const grupoIntegrado of gruposIntegrados) {
            try {
                const secaoAtualizada = {
                    name: grupoIntegrado.name,
                    // slug: grupoIntegrado.name,
                    title: grupoIntegrado.name,
                    small_description: grupoIntegrado.name,
                    parent_id: grupoIntegrado.parent_id
                }
                await atualizarCategoria(loja, accessToken, secaoAtualizada, grupoIntegrado.id)
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    logger.log({
                        level: 'error',
                        message: `Erro ao atualizar o grupo ${grupoIntegrado.name} da loja ${loja.LTR_CNPJ} -> 
                        Status: ${error.response?.status || 'Sem status'} 
                        Mensagem: ${JSON.stringify(error.response?.data.causes) || error.message} 
                        Endpoint: ${error.response?.data.url || ''}`
                    });
                } else {
                    logger.log({
                        level: 'error',
                        message: `Erro inesperado ao atualizar o grupo ${grupoIntegrado.name} da loja ${loja.LTR_CNPJ} -> ${error.message}`
                    });
                }
            }
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar grupos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}