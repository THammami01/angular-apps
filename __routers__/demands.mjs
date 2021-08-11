import express from "express";
import {
  getDemands,
  addDemand,
  validateDemand,
  updateDemand,
  deleteDemand,
} from "../__db__/demands.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  getDemands()
    .then((demands) => {
      res.status(200).send(demands);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.get("/employee/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId;
  
  getDemands(employeeId)
    .then((demands) => {
      res.status(200).send(demands);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.post("/", (req, res) => {
  const demand = req.body;
  delete demand.id;

  addDemand(demand)
    .then((data) => {
      res.status(201).send({ statusCode: 201 });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.patch("/validate/:id", (req, res) => {
  const id = req.params.id;
  const demandStatus = req.body.demandStatus;

  validateDemand(id, demandStatus)
    .then((data) => {
      res.send({ statusCode: 200 });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  deleteDemand(id)
    .then((data) => {
      res.status(200).send({ statusCode: 200 });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

export default router;
