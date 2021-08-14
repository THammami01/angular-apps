import { db } from "../index.mjs";

export const getUserById = (userId, userPwd) => {
  const sql = `SELECT * FROM User WHERE userId = ? AND userPwd = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [userId, userPwd], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};
