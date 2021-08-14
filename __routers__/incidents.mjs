import express from "express";
import { getIncidents, deleteIncident } from "../__db__/incidents.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  getIncidents()
    .then((incidentsArr) => {
      res.send({ incidents: JSON.parse(JSON.stringify(incidentsArr)) });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.delete("/:incidentNb", (req, res) => {
  const { incidentNb } = req.params;

  deleteIncident(incidentNb)
    .then(() => {
      res.send({ status: "Deleted Successfully" });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

export default router;
