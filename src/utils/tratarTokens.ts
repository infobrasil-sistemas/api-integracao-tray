import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ILojaTray } from "../interfaces/ILojaTray";
import { atualizarAccessToken } from "../services/lojas/auth/atualizarAccessToken";
import { atualizarTokens } from "../services/lojas/auth/atualizarTokens";

dayjs.extend(utc);

export async function tratarTokens(loja: ILojaTray, conexao: any) {
    try {
        let accessToken: string;
        const dataAtual = dayjs().utc();
        const dataExpiracaoAccessToken = dayjs(loja.LTR_EXPIRATION_ACCESS_TOKEN).utc();
        if (dataAtual.isAfter(dataExpiracaoAccessToken)) {
            const dataExpiracaoRefreshToken = dayjs(loja.LTR_EXPIRATION_REFRESH_TOKEN).utc();
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
