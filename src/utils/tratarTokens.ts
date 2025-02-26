import dayjs from "dayjs";
import { ILojaTray } from "../interfaces/ILojaTray";
import { atualizarAccessToken } from "../services/lojas/auth/atualizarAccessToken";
import { atualizarTokens } from "../services/lojas/auth/atualizarTokens";

export async function tratarTokens(loja: ILojaTray, conexao: any) {
    try {
        let accessToken: string;
        const dataAtual = dayjs().subtract(3, 'hour');
        const dataExpiracaoAccessToken = dayjs(loja.LTR_EXPIRATION_ACCESS_TOKEN);

        // Verifica se está faltando 1 minuto ou menos para expirar
        if (dataAtual.isAfter(dataExpiracaoAccessToken.subtract(2, 'minute'))) {
            const dataExpiracaoRefreshToken = dayjs(loja.LTR_EXPIRATION_REFRESH_TOKEN);
            if (dataAtual.isAfter(dataExpiracaoRefreshToken.subtract(2, 'minute'))) {
                accessToken = await atualizarTokens(loja, conexao);
            } else {
                accessToken = await atualizarAccessToken(loja, conexao);
                if (!accessToken) {
                    accessToken = await atualizarTokens(loja, conexao);
                }
            }
            return accessToken;
        } else {
            return loja.LTR_ACCESS_TOKEN;
        }
    } catch (error) {
        throw error;
    }
}
