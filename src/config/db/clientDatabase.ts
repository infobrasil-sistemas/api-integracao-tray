import firebird from 'node-firebird';

interface ConnectionOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  pageSize: number;
}

export const getConnection = (options: ConnectionOptions): Promise<firebird.Database> => {
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
