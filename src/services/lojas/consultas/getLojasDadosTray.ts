import { ILojaTray } from "../../../interfaces/ILojaTray";

export async function getLojasDadosTray(conexao: any): Promise<ILojaTray[]> {
    try {

        const query = `SELECT * FROM LOJAS_TRAY LTR WHERE LTR.LTR_SITUACAO = 'A'`

        return new Promise((resolve, reject) => {
            conexao.query(query, [], (erro: any, result: ILojaTray[]) => {
                if (erro) {
                    reject(erro)
                }
                else {
                    resolve(result)
                }
            })
        })
    } catch (error) {
        throw new Error(`Erro de conexao com o banco da API`)
    }

}