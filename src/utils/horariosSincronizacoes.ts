import dayjs from "dayjs";
import logger from "./logger";

let ultimaSincronizacaoEstoques: string | null = null;
export function atualizarUltimaSincronizacaoEstoques() {
    ultimaSincronizacaoEstoques = dayjs().format("YYYY-MM-DD HH:mm:ss");
}
export function obterUltimaSincronizacaoEstoques() {
    return ultimaSincronizacaoEstoques;
}


// let ultimaSincronizacaoProdutos: string | null = null;
// export function atualizarUltimaSincronizacaoProdutos() {
//     ultimaSincronizacaoProdutos = dayjs().format("YYYY-MM-DD HH:mm:ss");
// }
// export function obterUltimaSincronizacaoProdutos() {
//     return ultimaSincronizacaoProdutos;
// }


export function reiniciarUltimasSincronizacoes() {
    ultimaSincronizacaoEstoques = dayjs().subtract(3, 'minute').format("YYYY-MM-DD HH:mm:ss");
    logger.log({
        level: 'info',
        message: `Ultima sincronização reiniciada: ${ultimaSincronizacaoEstoques}`,
    });

}
