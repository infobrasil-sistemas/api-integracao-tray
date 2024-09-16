import { IConnectionOptions } from "../../config/db/lojaDatabase";
import { ILojaTray } from "../../interfaces/ILojaTray";
import { atualizarGrupos } from "./grupos/atualizarGrupos";
import { atualizarSecoes } from "./secoes/atualizarSecoes";

export async function atualizarCategorias(loja: ILojaTray, dadosConexao: IConnectionOptions) {
    await atualizarSecoes(loja, dadosConexao)
    await atualizarGrupos(loja, dadosConexao)
}