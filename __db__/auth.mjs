import { db } from "../index.mjs";

export const getEmployeeByRegistration = (registration, passkey) => {
  const sql = `SELECT * FROM Employee WHERE registration = ? AND passkey = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [registration, passkey], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};
