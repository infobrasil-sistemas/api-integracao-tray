import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { cadastrarGrupos } from "./grupos/cadastrarGrupos";
import { cadastrarSecoes } from "./secoes/cadastrarSecoes";

export async function cadastrarCategorias(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    await cadastrarSecoes(loja, dadosConexao)
    await cadastrarGrupos(loja, dadosConexao)
}