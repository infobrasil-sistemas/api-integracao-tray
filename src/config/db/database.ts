import firebird from 'node-firebird';
import dotenv from 'dotenv';

dotenv.config();

const options: firebird.Options = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!) ,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pageSize: parseInt(process.env.DB_PAGE_SIZE!)
};

export const getApiDatabaseConnection = (): Promise<firebird.Database> => {
  return new Promise<firebird.Database>((resolve, reject) => {
    firebird.attach(options, (err, db) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
};
