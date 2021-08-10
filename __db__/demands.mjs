import { db } from "../index.mjs";

export const getDemands = () => {
  const sql = `SELECT * FROM Demand;`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const addDemand = (demand) => {
  const sql = `
    INSERT INTO Demand
    SET ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, demand, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

export const updateDemand = (
  id,
  { employeeId, type, startDate, endDate, status }
) => {
  const sql = `
    UPDATE Demand
    SET employeeId = ?, demandType = ?, startDate = ?, endDate = ?, demandStatus = ?
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [employeeId, type, startDate, endDate, status, id], (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

export const deleteDemand = (id) => {
  const sql = `DELETE FROM Demand WHERE id = ?;`;

  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
