import dayjs from "dayjs";
import logger from "./logger";

let ultimaSincronizacaoEstoques: string | null = null;
export function atualizarUltimaSincronizacaoEstoques() {
    ultimaSincronizacaoEstoques = dayjs().format("YYYY-MM-DD HH:mm:ss");
}
export function obterUltimaSincronizacaoEstoques() {
    return ultimaSincronizacaoEstoques;
}

export function reiniciarUltimasSincronizacoes() {
    ultimaSincronizacaoEstoques = dayjs().subtract(3, 'minute').format("YYYY-MM-DD HH:mm:ss");
    logger.log({
        level: 'info',
        message: `Ultima sincronização reiniciada: ${ultimaSincronizacaoEstoques}`,
    });

}
