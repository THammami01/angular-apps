// import path from "path";
import process from "process";
import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";

import employees from "./__routers__/employees.mjs";
import auth from "./__routers__/auth.mjs";
import demands from "./__routers__/demands.mjs";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/auth", auth);
app.use("/employees", employees);
app.use("/demands", demands);

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  // res.sendFile("index.html", { root: path.resolve(path.dirname("")) });
  res.send({
    status: "Running.."
  })
});

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
