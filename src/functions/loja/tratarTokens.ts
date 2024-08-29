import { ILojaTray } from "../../interfaces/ILojaTray";

export function tratarTokens(loja: ILojaTray){
    console.log(loja)
    const dataAtual = new Date()
    const dataExpiracaoAcessToken = new Date(loja.LTR_EXPIRATION_ACESS_TOKEN)
    if(dataAtual >= dataExpiracaoAcessToken){
        console.log("ACESS TOKEN EXPIRADO")
        
    }
    else{
        console.log("ACESS TOKEN VÁLIDO")
        return loja
    }
}


    
    // VERIFICAR SE A DATA DE EXPIRAÇÃO DO REFRESH TOKEN JA PASSOU (10 minutos de sobra)
        // SE SIM
            // REALIZAR REQUISIÇÃO UTILIZANDO (CONSUMER_KEY, CONSUMER_SECRET, CODE) PARA OBTER NOVOS DADOS (ACCESS_TOKEN, REFRESH_TOKEN, E DATAS DE EXPIRACAO)
            // ATUALIZAR DADOS DA TABELA
            // RETORNAR ACESS TOKEN  
        // SE NAO
            // VERIFICAR SE A DATA DE EXPIRAÇÃO DO ACESS TOKEN JA PASSOU (10 minutos de sobra)
                // SE SIM   
                    // REALIZAR A REQUISIÇÃO UTILIZANDO REFRESH TOKEN PARA OBTER O NOVO ACESS TOKEN
                    // ATUALIZAR ACESS TOKEN E DATA DE EXPIRACAO NA TABELA
                    // RETORNAR ACESS TOKEN
                // SE NAO
                    // RETORNAR ACESS TOKEN