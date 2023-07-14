const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authenticator = (req, res, next) => {
  let token = req.cookies.Token;

  try {
    if (token) {
      jwt.verify(token, process.env.key, (err, decodedToken) => {
        if (decodedToken) {
          req.employeeId = decodedToken.employeeId;
          next();
        } else {
          res.status(401).json({ error: "Invalid token" });
        }
      });
    } else {
      res.status(401).json({ error: "Token not found" });
    }
  } catch (error) {
    res.status(401).json({ Error: error.message });
  }
};

module.exports = { authenticator };
