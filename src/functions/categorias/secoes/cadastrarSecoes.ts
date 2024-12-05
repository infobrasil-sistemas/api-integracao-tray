import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import { getSecoesNaoIntegradas } from "../../../services/categorias/consultas/getSecoesNaoIntegradas";
import { enviarSecao } from "../../../services/categorias/tray/envios/enviarSecao";
import logger from "../../../utils/logger";


export async function cadastrarSecoes(loja: ILojaTray, conexao: IConnectionOptions, accessToken: string) {
    try {
        const secoesNaoIntegradas = await getSecoesNaoIntegradas(loja.LTR_CNPJ, conexao)
        if (secoesNaoIntegradas.length > 0) {
            for (const secao of secoesNaoIntegradas) {
                await enviarSecao(loja, conexao, accessToken, secao)
            }
        }

    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar seções da loja ${loja.LTR_CNPJ} -> ${error}`
        });
    }
}


