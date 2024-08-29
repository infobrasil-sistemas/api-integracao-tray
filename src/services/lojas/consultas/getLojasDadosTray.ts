import { getApiDatabaseConnection } from "../../../config/db/database";
import { ILojaTray } from "../../../interfaces/ILojaTray";

export async function getLojasDadosTray(): Promise<ILojaTray[]>{
    const conexao = await getApiDatabaseConnection()

    const query = `SELECT * FROM LOJAS_TRAY`

    return new Promise((resolve, reject) => {
        conexao.query(query, [], (erro: any, result: ILojaTray[]) => {
            if(erro){
                reject(erro)
            }
            else{
                resolve(result)
            }
        })
    })
}