import { getLojasDadosTray } from "../../services/lojas/consultas/getLojasDadosTray";
import { tratarTokens } from "../loja/tratarTokens";

export async function cadastrarProdutos(){
    const lojas = await getLojasDadosTray()
    for(const loja of lojas){
        const acessToken = tratarTokens(loja)
    }
}