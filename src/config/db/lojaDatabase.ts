import firebird from 'node-firebird';
import { ids } from '../../utils/ids';

export interface IConnectionOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  id: number;
  pageSize: number;
}

export const getLojaDatabaseConnection = (options: IConnectionOptions): Promise<firebird.Database> => {
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
