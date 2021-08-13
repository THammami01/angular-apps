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

export const checkOldPwd = (user, pwds) => {
  const sql = `SELECT userPwd from User WHERE userNb = ? AND userId = ? AND userPwd = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [user.userNb, user.userId, pwds.oldPwd], (err, results) => {
      if (err) return resolve(err);
      if (results.length === 0) return resolve("INCORRECT_OLD_PWD");
      return resolve(results);
    });
  });
};

export const changePwd = async (user, pwds) => {
  const sql = `UPDATE User SET userPwd = ? WHERE userNb = ? AND userId = ? AND userPwd = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [user.userNb, user.userId, pwds.oldPwd], (err, results) => {
      db.query(
        sql,
        [pwds.newPwd, user.userNb, user.userId, pwds.oldPwd],
        (err, results) => {
          if (err) return reject(err);
          if (results.affectedRows === 0) return resolve("NO_AFFECTED_ROWS");
          return resolve(results);
        }
      );
    });
  });
};
