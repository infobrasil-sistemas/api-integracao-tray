import { getApiDatabaseConnection } from '../config/db/database';

interface ClientDbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  pageSize: number;
}

export async function getClientDbConfig(clienteCodigo: string): Promise<ClientDbConfig> {
  const mainDb = await getApiDatabaseConnection();

  return new Promise<ClientDbConfig>((resolve, reject) => {
    mainDb.query(
      `
      SELECT 
        ETR_HOST ,
        ETR_PORTA ,
        ETR_PASSWORD ,
        ETR_USER , 
        ETR_CAMINHO ,
        ETR_ID ,
        ETR_CNPJ ,
        UTR_CODIGO
      FROM ENDERECOS_TRAY WHERE ETR_CODIGO = ?
      `,
      [clienteCodigo],
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
          reject(new Error('Cliente não encontrado'));
        }
        mainDb.detach();
      }
    );
  });
}
