import { getLojasDadosTray } from "../../services/lojas/consultas/getLojasDadosTray";
import logger from "../../utils/logger";
import { cadastrarGrupos } from "./grupos/cadastrarGrupos";
import { cadastrarSecoes } from "./secoes/cadastrarSecoes";

export async function cadastrarCategorias() {
    try {
        const lojas = await getLojasDadosTray()
        await cadastrarSecoes(lojas) 
        await cadastrarGrupos(lojas)
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Erro ao cadastrar categorias -> ${error}`
        });
    }
}