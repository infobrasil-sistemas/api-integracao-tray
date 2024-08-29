import { getApiDatabaseConnection } from "../../../config/db/database";

interface LojaDbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  pageSize: number;
}

export async function getLojaDbConfig(enderecoCodigo: string): Promise<LojaDbConfig> {
  const mainDb = await getApiDatabaseConnection();

  return new Promise<LojaDbConfig>((resolve, reject) => {
    mainDb.query(
      `
      SELECT 
        DAD_HOST ,
        DAD_PORTA ,
        DAD_PASSWORD ,
        DAD_USER , 
        DAD_CAMINHO ,
        DAD_ID ,
        DAD_CNPJ ,
      FROM DADOS_ENDERECO WHERE DAD_CODIGO = ?
      `,
      [enderecoCodigo],
      (err, result) => {
        if (err) {
          reject(err);
        } else if (result.length > 0) {
          const config = result[0];
          resolve({
            host: config.HOST,
            port: parseInt(config.PORT, 10),
            database: config.DATABASE,
            user: config.USER,
            password: config.PASSWORD,
            pageSize: 4096
          });
        } else {
          reject(new Error('Endereço não encontrado'));
        }
        mainDb.detach();
      }
    );
  });
}
