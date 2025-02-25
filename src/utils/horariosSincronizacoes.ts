import dayjs from "dayjs";

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
    ultimaSincronizacaoEstoques = dayjs().subtract(7, 'minute').format("YYYY-MM-DD HH:mm:ss");
}
