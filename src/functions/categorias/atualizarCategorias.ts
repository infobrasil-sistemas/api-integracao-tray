import { ILojaTray } from "../../interfaces/ILojaTray";
import { atualizarGrupos } from "./grupos/atualizarGrupos";
import { atualizarSecoes } from "./secoes/atualizarSecoes";

export async function atualizarCategorias(loja: ILojaTray, conexao: any) {
    await atualizarSecoes(loja, conexao)
    await atualizarGrupos(loja, conexao)
}