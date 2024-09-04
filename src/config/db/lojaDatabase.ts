import firebird from 'node-firebird';

export interface IConnectionOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  pageSize: number;
}

export const getLojaDatabaseConnection = (options: IConnectionOptions): Promise<firebird.Database> => {
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
