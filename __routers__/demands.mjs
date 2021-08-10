import express from "express";
import {
  getDemands,
  addDemand,
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

router.post("/", (req, res) => {
  const demand = req.body;
  delete demand.id;

  addDemand(demand)
    .then((data) => {
      console.log(data);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const demand = req.body;
  delete demand.id;

  updateDemand(id, demand)
    .then((data) => {
      console.log(data);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  deleteDemand(id)
    .then((data) => {
      console.log(data);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
export default router;
