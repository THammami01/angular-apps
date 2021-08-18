import express from "express";
import {
  getIncidents,
  getIncident,
  addIncident,
  getMaxIncidentNb,
  updateIncident,
  deleteIncident,
} from "../__db__/incidents.mjs";

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

router.get("/:incidentNb", (req, res) => {
  const { incidentNb } = req.params;

  getIncident(incidentNb)
    .then((incidentsArr) => {
      res.send({ incident: JSON.parse(JSON.stringify(incidentsArr)) });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.post("/", async (req, res) => {
  const newIncident = req.body;

  try {
    newIncident.incidentNb = (await getMaxIncidentNb()) + 1;
  } catch {
    res.sendStatus(500);
  }

  addIncident(newIncident)
    .then((data) => {
      res
        .status(201)
        .send({
          status: "Added Successfully",
          incidentNb: newIncident.incidentNb,
        });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.patch("/", async (req, res) => {
  const newIncident = req.body;

  updateIncident(newIncident)
    .then((data) => {
      res.send({ status: "Modified Successfully" });
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
