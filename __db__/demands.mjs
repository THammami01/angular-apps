import { db } from "../index.mjs";

export const getDemands = (employeeId) => {
  if (employeeId) {
    const sql = `
    SELECT * FROM Demand
    WHERE employeeId = ?
    ORDER BY id DESC;
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [employeeId], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  } else {
    const sql = `
    SELECT D.*, CONCAT(E.firstname, " ", E.lastname) AS employeeName
    FROM Demand AS D, Employee AS E
    WHERE D.employeeId = E.id
    ORDER BY D.id DESC;
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    });
  }
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

export const validateDemand = (id, demandStatus) => {
  if (demandStatus === "Supprimée") {
    const sql = `
    DELETE FROM Demand
    WHERE id = ?;
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  } else {
    const sql = `
    UPDATE Demand
    SET demandStatus = ?, updateDate = NOW()
    WHERE id = ?;
  `;

    return new Promise((resolve, reject) => {
      db.query(sql, [demandStatus, id], (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
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
