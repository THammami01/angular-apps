import path from "path";
import process from "process";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./__routers__/auth.mjs";
import patients from "./__routers__/patients.mjs";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.use(express.static("FE/dist/angular-app"));
app.set("view engine", "pug");

app.use("/api/auth", auth);
app.use("/api/patients", patients);

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.resolve(path.dirname("")) });
  // res.send({
  //   status: "Running..",
  // });
});

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(path.resolve(path.dirname("")), "FE/dist/angular-app/index.html"),
    (err) => {
      if (err) res.status(500).send(err);
    }
  );
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
