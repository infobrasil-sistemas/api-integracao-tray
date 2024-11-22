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
                    slug: grupoIntegrado.name,
                    title: grupoIntegrado.name,
                    small_description: grupoIntegrado.name,
                    parent_id: grupoIntegrado.parent_id
                }
                await atualizarCategoria(loja, accessToken, secaoAtualizada, grupoIntegrado.id)
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