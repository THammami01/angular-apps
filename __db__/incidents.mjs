import { db } from "../index.mjs";

export const getIncidents = () => {
  const sql = `SELECT * FROM Patient ORDER BY incidentNb DESC;`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const getIncident = (incidentNb) => {
  const sql = `SELECT * FROM Patient WHERE incidentNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [incidentNb], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const addIncident = (newIncident) => {
  const sql = `INSERT INTO Patient SET ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, newIncident, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const updateIncident = (newIncident) => {
  const sql = `UPDATE Patient SET ? WHERE incidentNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [newIncident, newIncident.incidentNb], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const getMaxIncidentNb = () => {
  const sql = `SELECT MAX(incidentNb) AS maxIncidentNb FROM Patient;`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results[0].maxIncidentNb);
    });
  });
};

export const deleteIncident = (incidentNb) => {
  const sql = `DELETE FROM Patient WHERE incidentNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [incidentNb], (err, res) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
