import { getLojaDbConfig } from "../../services/lojas/consultas/getLojaDbConfig";
import { getLojasDadosTray } from "../../services/lojas/consultas/getLojasDadosTray";
import { getProdutosNaoIntegrados } from "../../services/produtos/consultas/getProdutosNaoIntegrados";

export async function cadastrarProdutos(){
    const lojas = await getLojasDadosTray()
    for(const loja of lojas){
        const dadosConexao = await getLojaDbConfig(loja.DAD_CODIGO)
        const produtosNaoIntegrados = await getProdutosNaoIntegrados(dadosConexao)
        console.log(produtosNaoIntegrados)
        // loop chamando funcao no service pra enviar cada produto nao integrado -> na hora de enviar chamar tratarTokens()
    
        
    }
}



// 1. Buscar produtos eccomerce sim que nao estão integrados -> select com todos os dados necessários pra tray

// 2. Percorrendo produtos:
// 	- tratar e montar objeto
// 	- enviar
// 	- atualizar no banco como integrado

// Rotina de produtos:
// 	1. Atualizar produtos
// 	2. Cadastrar produtos