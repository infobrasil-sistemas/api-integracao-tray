import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getGruposNaoIntegrados } from "../../../services/categorias/consultas/getGruposNaoIntegrados";
import { enviarGrupo } from "../../../services/categorias/tray/envios/enviarGrupo";
import logger from "../../../utils/logger";
import { tratarTokens } from "../../../utils/tratarTokens";

export async function cadastrarGrupos(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    try {
        const gruposNaoIntegrados = await getGruposNaoIntegrados(loja.LTR_CNPJ, dadosConexao)
        if (gruposNaoIntegrados.length > 0) {
            const accessToken = await tratarTokens(loja)
            for (const grupo of gruposNaoIntegrados) {
                await enviarGrupo(loja, dadosConexao, accessToken, grupo)
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


