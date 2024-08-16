// import firebird from 'node-firebird';

// const options = {
//   host: 'localhost',
//   port: 3050,
//   database: 'path_to_your_database.fdb',
//   user: 'SYSDBA',
//   password: 'masterkey',
//   role: null,
//   pageSize: 4096
// };

// export const getDatabaseConnection = () => {
//   return new Promise<firebird.Database>((resolve, reject) => {
//     firebird.attach(options, (err: any, db: any) => {
//       if (err) reject(err);
//       else resolve(db);
//     });
//   });
// };
