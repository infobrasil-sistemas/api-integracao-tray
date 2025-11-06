import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getGruposNaoIntegrados } from "../../../services/categorias/consultas/getGruposNaoIntegrados";
import { enviarGrupo } from "../../../services/categorias/tray/envios/enviarGrupo";
import logger from "../../../utils/logger";

export async function cadastrarGrupos(loja: ILojaTray, conexao: IConnectionOptions, accessToken: string) {
    try {
        const gruposNaoIntegrados = await getGruposNaoIntegrados(loja.LTR_CNPJ, conexao)
        if (gruposNaoIntegrados.length > 0) {
            for (const grupo of gruposNaoIntegrados) {
                await enviarGrupo(loja, conexao, accessToken, grupo)
            }
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar grupos da loja ${loja.LTR_NOME} -> ${error}`
        });
    }

}


