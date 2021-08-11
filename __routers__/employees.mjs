import express from "express";
import {
  addEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../__db__/employees.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  getEmployees()
    .then((employees) => {
      res.status(200).send(employees);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
  const employee = req.body;
  delete employee.id;

  addEmployee(employee)
    .then((data) => {
      res.status(201).send({statusCode: 201});
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const employee = req.body;
  delete employee.id;

  updateEmployee(id, employee)
    .then((data) => {
      res.send(200).send({statusCode: 200});
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  deleteEmployee(id)
    .then((data) => {
      res.send(200).send({statusCode: 200});
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

export default router;
