import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { getEmployeeByRegistration } from "../__db__/auth.mjs";

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const generateAccessToken = (employee) => {
  const accessToken = jwt.sign({ employee }, ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return accessToken;
};

router.post("/login", (req, res) => {
  // const { registration, passkey } = req.body;

  // getEmployeeByRegistration(registration, passkey)
  //   .then((employeeArr) => {
  //     if (employeeArr.length != 1) res.send({ accessToken: "NO_ACCESS_TOKEN" });
  //     else {
  //       delete employeeArr[0].passkey;
  //       res.send({ accessToken: generateAccessToken(employeeArr[0]) });
  //     }
  //   })
  //   .catch((err) => res.sendStatus(500));
});

router.delete("/logout", (req, res) => {
  res.send({ statusCode: 200 });
});

export default router;
