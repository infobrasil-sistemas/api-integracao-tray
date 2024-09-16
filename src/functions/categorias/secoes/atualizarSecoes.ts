import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getSecoesIntegradas } from "../../../services/categorias/consultas/getSecoesIntegradas";
import { getCategoria } from "../../../services/categorias/tray/consultas/getCategoria";
import { atualizarCategoria } from "../../../services/categorias/tray/envios/atualizarCategoria";
import logger from "../../../utils/logger";
import { tratarTokens } from "../../../utils/tratarTokens";


export async function atualizarSecoes(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    try {
        const secoesIntegradas = await getSecoesIntegradas(loja.LTR_CNPJ, dadosConexao)
        const accessToken = await tratarTokens(loja)
        for (const secaoIntegrada of secoesIntegradas) {
            try {
                const secaoTray = await getCategoria(loja, accessToken, secaoIntegrada.id)
                if (secaoIntegrada.name !== secaoTray.name) {
                    const secaoAtualizada = {
                        name: secaoIntegrada.name,
                        slug: secaoIntegrada.name,
                        title: secaoIntegrada.name,
                        small_description: secaoIntegrada.name,
                    }
                    await atualizarCategoria(loja, accessToken, secaoAtualizada, secaoTray.id)
                }
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