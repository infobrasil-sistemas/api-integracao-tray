import { getApiDatabaseConnection } from "../../../config/db/database";
import { ILojaTray } from "../../../interfaces/ILojaTray";
import logger from "../../../utils/logger";

export async function getLojasDadosTray(): Promise<ILojaTray[]> {
    try {
        const conexao = await getApiDatabaseConnection()

        const query = `SELECT * FROM LOJAS_TRAY`

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
        logger.log({
            level: 'error',
            message: `Erro de conexao com o banco da API -> ${error}`
        });
        throw new Error(`Erro de conexao com o banco da API`)
    }

}