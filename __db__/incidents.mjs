import { db } from "../index.mjs";

export const getIncidents = () => {
  const sql = `SELECT * FROM Incident;`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const deleteIncident = (incidentNb) => {
  const sql = `DELETE FROM Incident WHERE incidentNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [incidentNb], (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
