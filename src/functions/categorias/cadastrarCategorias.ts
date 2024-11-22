import { ILojaTray } from "../../interfaces/ILojaTray";
import { cadastrarGrupos } from "./grupos/cadastrarGrupos";
import { cadastrarSecoes } from "./secoes/cadastrarSecoes";

export async function cadastrarCategorias(loja: ILojaTray, conexao: any, accessToken: string) {
    await cadastrarSecoes(loja, conexao, accessToken)
    await cadastrarGrupos(loja, conexao, accessToken)
}