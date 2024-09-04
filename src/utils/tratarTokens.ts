import { ILojaTray } from "../interfaces/ILojaTray"
import { atualizarAccessToken } from "../services/lojas/auth/atualizarAccessToken"
import { atualizarTokens } from "../services/lojas/auth/atualizarTokens"

export async function tratarTokens(loja: ILojaTray) {
    try {
        let accessToken: string
        const dataAtual = new Date()
        const dataExpiracaoAcessToken = new Date(loja.LTR_EXPIRATION_ACESS_TOKEN)
        if (dataAtual >= dataExpiracaoAcessToken) {
            const dataExpiracaoRefreshToken = new Date(loja.LTR_EXPIRATION_REFRESH_TOKEN)
            if (dataAtual >= dataExpiracaoRefreshToken) {
                accessToken = await atualizarTokens(loja)
            }
            else {
                accessToken = await atualizarAccessToken(loja)
            }
            return accessToken
        }
        else {
            return loja.LTR_ACCESS_TOKEN
        }
    } catch (error) {
        throw error
    }

}
