import { ILojaTray } from "../../interfaces/ILojaTray";
import { atualizarGrupos } from "./grupos/atualizarGrupos";
import { atualizarSecoes } from "./secoes/atualizarSecoes";

export async function atualizarCategorias(loja: ILojaTray, conexao: any, accessToken: any) {
    await atualizarSecoes(loja, conexao, accessToken)
    await atualizarGrupos(loja, conexao, accessToken)
}