import { IConnectionOptions } from "../../../config/db/lojaDatabase";
import { getApiDatabaseConnection } from "../../../config/db/database";

export async function getLojaDbConfig(enderecoCodigo: number): Promise<IConnectionOptions> {
  try {
    const mainDb = await getApiDatabaseConnection();

    return new Promise<IConnectionOptions>((resolve, reject) => {
      mainDb.query(
        `
      SELECT 
        DAD_HOST ,
        DAD_PORTA ,
        DAD_USER , 
        DAD_CAMINHO ,
        DAD_ID ,
        DAD_CNPJ
      FROM DADOS_ENDERECO WHERE DAD_CODIGO = ?
      `,
        [enderecoCodigo],
        (err, result) => {
          if (err) {
            reject(err);
          } else if (result.length > 0) {
            const config = result[0];
            resolve({
              host: config.DAD_HOST,
              port: parseInt(config.DAD_PORTA, 10),
              database: config.DAD_CAMINHO,
              user: config.DAD_USER,
              id: config.DAD_ID,
              pageSize: 4096
            });
          } else {
            reject(new Error('Endereço não encontrado'));
          }
          mainDb.detach();
        }
      );
    });
  } catch (error) {
    throw new Error(`Erro de conexao com o banco da API`)
  }

}
