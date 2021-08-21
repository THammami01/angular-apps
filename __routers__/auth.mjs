import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { getUserById, changePwd } from "../__db__/auth.mjs";
import { checkOldPwd } from "../__db__/auth.mjs";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const router = express.Router();

const generateAccessToken = (user) => {
  const accessToken = jwt.sign({ user }, ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
  return accessToken;
};

router.post("/login", (req, res) => {
  const { userId, userPwd } = req.body;

  getUserById(userId, userPwd)
    .then((usersArr) => {
      if (usersArr.length != 1) res.send({ accessToken: "NO_ACCESS_TOKEN" });
      else {
        delete usersArr[0].passkey;
        res.send({ accessToken: generateAccessToken(usersArr[0]) });
      }
    })
    .catch((err) => res.sendStatus(500));
});

// router.delete("/logout", (req, res) => {
//   res.send({ statusCode: 200 });
// });

router.post("/change-pwd", authMiddleware, (req, res) => {
  const user = req.user.user;
  const pwds = req.body;

  checkOldPwd(user, pwds)
    .then((results) => {
      if (results === "INCORRECT_OLD_PWD") return res.send({ status: results });
      else {
        changePwd(user, pwds)
          .then((results) => {
            if (results === "NO_ROWS_AFFECTED")
              return res.send({ status: results });
            else res.send({ status: "Password Changed Successfully" });
          })
          .catch((err) => {
            res.sendStatus(500);
          });
      }
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

export default router;
