import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getSecoesNaoIntegradas } from "../../../services/categorias/consultas/getSecoesNaoIntegradas";
import { enviarSecao } from "../../../services/categorias/tray/envios/enviarSecao";
import logger from "../../../utils/logger";
import { tratarTokens } from "../../../utils/tratarTokens";


export async function cadastrarSecoes(loja: ILojaTray, conexao: IConnectionOptions) {
    try {
        const secoesNaoIntegradas = await getSecoesNaoIntegradas(loja.LTR_CNPJ, conexao)
        if (secoesNaoIntegradas.length > 0) {
            const accessToken = await tratarTokens(loja)
            for (const secao of secoesNaoIntegradas) {
                await enviarSecao(loja, conexao, accessToken, secao)
            }
        }
        else {
            logger.log({
                level: 'info',
                message: `Nenhuma seção nova para a loja ${loja.LTR_CNPJ}`
            });
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar seções da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}


