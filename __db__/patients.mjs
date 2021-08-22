import { db } from "../index.mjs";

export const getPatients = () => {
  const sql = `SELECT * FROM Patient ORDER BY patientNb DESC;`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const getPatient = (patientNb) => {
  const sql = `SELECT * FROM Patient WHERE patientNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [patientNb], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const addPatient = (newPatient) => {
  const sql = `INSERT INTO Patient SET ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, newPatient, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const updatePatient = (newPatient) => {
  const sql = `UPDATE Patient SET ? WHERE patientNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [newPatient, newPatient.patientNb], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const getMaxPatientNb = () => {
  const sql = `SELECT MAX(patientNb) AS maxPatientNb FROM Patient;`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results[0].maxPatientNb);
    });
  });
};

export const deletePatient = (patientNb) => {
  const sql = `DELETE FROM Patient WHERE patientNb = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [patientNb], (err, res) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
