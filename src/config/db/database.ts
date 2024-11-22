import firebird from 'node-firebird';
import dotenv from 'dotenv';
import { IConnectionOptions } from './lojaDatabase';
import { ids } from '../../utils/ids';

dotenv.config();

const options: IConnectionOptions = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!) ,
  database: process.env.DB_DATABASE!,
  user: process.env.DB_USER!,
  id: parseInt(process.env.DB_ID!),
  pageSize: parseInt(process.env.DB_PAGE_SIZE!)
};

export const getApiDatabaseConnection = (): Promise<firebird.Database> => {
  const optionsFinal = {
    ...options,
    password: ids(options.id)
  }
  return new Promise<firebird.Database>((resolve, reject) => {
    firebird.attach(optionsFinal, (err, db) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
};
