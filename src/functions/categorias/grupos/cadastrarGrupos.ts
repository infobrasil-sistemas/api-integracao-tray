import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getGruposNaoIntegrados } from "../../../services/categorias/consultas/getGruposNaoIntegrados";
import { cadastrarCategoriaGrupo } from "../../../services/categorias/envios/cadastrarCategoriaGrupo";
import { getLojaDbConfig } from "../../../services/lojas/consultas/getLojaDbConfig";
import logger from "../../../utils/logger";
import { tratarTokens } from "../../../utils/tratarTokens";

export async function cadastrarGrupos(lojas: ILojaTray[]) {
    for (const loja of lojas) {
        try {
            const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO)
            const gruposNaoIntegrados = await getGruposNaoIntegrados(loja.LTR_CNPJ, dadosConexao)
            if (gruposNaoIntegrados.length > 0) {
                const accessToken = await tratarTokens(loja)
                for (const grupo of gruposNaoIntegrados) {
                    await cadastrarCategoriaGrupo(loja, dadosConexao, accessToken, grupo)
                }
            } else {
                logger.log({
                    level: 'info',
                    message: `Nenhum grupo novo para a loja ${loja.LTR_CNPJ}`
                });
            }
        } catch (error) {
            logger.log({
                level: 'error',
                message: `Erro ao cadastrar grupos da loja ${loja.LTR_CNPJ} -> ${error}`
            });
        }
    }

}


