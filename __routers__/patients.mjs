import express from "express";
import {
  getPatients,
  getPatient,
  addPatient,
  getMaxPatientNb,
  updatePatient,
  deletePatient,
} from "../__db__/patients.mjs";
import { authMiddleware } from "./auth.mjs";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  getPatients()
    .then((patientsArr) => {
      res.send({ patients: JSON.parse(JSON.stringify(patientsArr)) });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.get("/:patientNb", authMiddleware, (req, res) => {
  const { patientNb } = req.params;

  getPatient(patientNb)
    .then((patientsArr) => {
      res.send({ patient: JSON.parse(JSON.stringify(patientsArr)) });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.post("/", authMiddleware, async (req, res) => {
  const newPatient = req.body;

  try {
    newPatient.patientNb = (await getMaxPatientNb()) + 1;
  } catch {
    res.sendStatus(500);
  }

  addPatient(newPatient)
    .then((data) => {
      res.status(201).send({
        status: "Added Successfully",
        patientNb: newPatient.patientNb,
      });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.patch("/", authMiddleware, async (req, res) => {
  const newPatient = req.body;

  updatePatient(newPatient)
    .then((data) => {
      res.send({ status: "Modified Successfully" });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

router.delete("/:patientNb", (req, res) => {
  const { patientNb } = req.params;

  deletePatient(patientNb)
    .then(() => {
      res.send({ status: "Deleted Successfully" });
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

export default router;
