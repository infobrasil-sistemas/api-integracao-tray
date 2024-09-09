import { getLojasDadosTray } from "../../services/lojas/consultas/getLojasDadosTray";
import logger from "../../utils/logger";
import { atualizarGrupos } from "./grupos/atualizarGrupos";
import { atualizarSecoes } from "./secoes/atualizarSecoes";

export async function atualizarCategorias() {
    try {
        const lojas = await getLojasDadosTray()
        for (const loja of lojas) {
            await atualizarSecoes(loja)
            await atualizarGrupos(loja)
        }
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao atualizar categorias -> ${error}`
        });
    }
}