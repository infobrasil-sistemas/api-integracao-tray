import { cadastrarCategorias } from "../functions/categorias/cadastrarCategorias";
import logger from "../utils/logger";

export async function sincronizarCategorias(){
    logger.log({
        level: 'info',
        message: `Sincronizando categorias...`
    });
    // await atualizarCategorias()
    await cadastrarCategorias()
    logger.log({
        level: 'info',
        message: `Categorias sincronizadas com sucesso.`
    });
}