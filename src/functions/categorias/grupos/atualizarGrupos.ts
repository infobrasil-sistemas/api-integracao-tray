import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getGruposIntegrados } from "../../../services/categorias/consultas/getGruposIntegrados";
import { getCategoria } from "../../../services/categorias/tray/consultas/getCategoria";
import { atualizarCategoria } from "../../../services/categorias/tray/envios/atualizarCategoria";
import logger from "../../../utils/logger";
import { tratarTokens } from "../../../utils/tratarTokens";


export async function atualizarGrupos(loja: ILojaTray, conexao: any) {
    try {
        const gruposIntegrados = await getGruposIntegrados(loja.LTR_CNPJ, conexao)
        const accessToken = await tratarTokens(loja)
        for (const grupoIntegrado of gruposIntegrados) {
            try {
                const grupoTray = await getCategoria(loja, accessToken, grupoIntegrado.id)
                if (grupoIntegrado.name != grupoTray.name || grupoIntegrado.parent_id != grupoTray.parent_id) {
                    const secaoAtualizada = {
                        name: grupoIntegrado.name,
                        slug: grupoIntegrado.name,
                        title: grupoIntegrado.name,
                        small_description: grupoIntegrado.name,
                        parent_id: grupoIntegrado.parent_id
                    }
                    await atualizarCategoria(loja, accessToken, secaoAtualizada, grupoTray.id)
                }
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro ao atualizar o grupo ${grupoIntegrado.name} da loja ${loja.LTR_CNPJ} -> ${error}`
                });
            }
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar grupos da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}