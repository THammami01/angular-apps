import { db } from "../index.mjs";

export const getEmployees = () => {
  const sql = `SELECT * FROM employee`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      console.log(results);
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export const addEmployee = (employee) => {
  const sql = `
    INSERT INTO Employee
    SET ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, employee, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};

export const updateEmployee = (
  id,
  { registration, firstname, lastname, position, phone, email, passkey }
) => {
  console.log("----");
  console.log(
    id,
    registration,
    firstname,
    lastname,
    position,
    phone,
    email,
    passkey
  );
  console.log("----");

  const sql = `
    UPDATE Employee
    SET registration = ?, firstname = ?, lastname = ?, position = ?, phone = ?, email = ?, passkey = ?
    WHERE id = ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [registration, firstname, lastname, position, phone, email, passkey, id],
      (err) => {
        if (err) return reject(err);
        return resolve();
      }
    );
  });
};

export const deleteEmployee = (id) => {
  const sql = `DELETE FROM Employee WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
