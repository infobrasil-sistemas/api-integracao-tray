import dayjs from "dayjs";
import { ILojaTray } from "../interfaces/ILojaTray";
import { atualizarAccessToken } from "../services/lojas/auth/atualizarAccessToken";
import { atualizarTokens } from "../services/lojas/auth/atualizarTokens";

export async function tratarTokens(loja: ILojaTray, conexao: any) {
    try {
        let accessToken: string;
        const dataAtual = dayjs();
        const dataExpiracaoAccessToken = dayjs(loja.LTR_EXPIRATION_ACCESS_TOKEN);

        if (dataAtual.isAfter(dataExpiracaoAccessToken)) {
            const dataExpiracaoRefreshToken = dayjs(loja.LTR_EXPIRATION_REFRESH_TOKEN);
            if (dataAtual.isAfter(dataExpiracaoRefreshToken)) {
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
