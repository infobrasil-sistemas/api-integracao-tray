import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getSecoesIntegradas } from "../../../services/categorias/consultas/getSecoesIntegradas";
import { atualizarCategoria } from "../../../services/categorias/tray/envios/atualizarCategoria";
import logger from "../../../utils/logger";
import { tratarTokens } from "../../../utils/tratarTokens";


export async function atualizarSecoes(loja: ILojaTray, conexao: any) {
    try {
        const secoesIntegradas = await getSecoesIntegradas(loja.LTR_CNPJ, conexao)
        const accessToken = await tratarTokens(loja)
        for (const secaoIntegrada of secoesIntegradas) {
            try {
                const secaoAtualizada = {
                    name: secaoIntegrada.name,
                    slug: secaoIntegrada.name,
                    title: secaoIntegrada.name,
                    small_description: secaoIntegrada.name,
                }
                await atualizarCategoria(loja, accessToken, secaoAtualizada, secaoIntegrada.id)
                // const secaoTray = await getCategoria(loja, accessToken, secaoIntegrada.id)     // LOGICA COM COMPARAÇÃO
                // if (secaoIntegrada.name !== secaoTray.name) {
                //     const secaoAtualizada = {
                //         name: secaoIntegrada.name,
                //         slug: secaoIntegrada.name,
                //         title: secaoIntegrada.name,
                //         small_description: secaoIntegrada.name,
                //     }
                //     await atualizarCategoria(loja, accessToken, secaoAtualizada, secaoTray.id)
                // }
            } catch (error) {
                logger.log({
                    level: 'error',
                    message: `Erro ao atualizar a seção ${secaoIntegrada.name} da loja ${loja.LTR_CNPJ} -> ${error}`
                });
            }

        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar seções da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }

}