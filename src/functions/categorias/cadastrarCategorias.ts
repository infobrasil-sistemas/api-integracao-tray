import { ILojaTray } from "../../interfaces/ILojaTray";
import { cadastrarGrupos } from "./grupos/cadastrarGrupos";
import { cadastrarSecoes } from "./secoes/cadastrarSecoes";

export async function cadastrarCategorias(loja: ILojaTray, conexao: any) {
    await cadastrarSecoes(loja, conexao)
    await cadastrarGrupos(loja, conexao)
}