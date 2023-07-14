const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const Erouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { employeeModel } = require("../Model/Employee_Modal");

Erouter.get("/", (req, res) => {
  res.send("Welcome To Fastor Backend CRM APIs");
});

//Register
Erouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    bcrypt.hash(password, +process.env.saltround, async (err, hash) => {
      if (err) {
        console.log({ message: err.message });
      } else {
        let data = new employeeModel({
          name,
          email,
          password: hash,
        });

        await data.save();

        res.status(200).json({ message: "Employee registered successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//Login
Erouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let data = await employeeModel.findOne({ email });

    if (data) {
      bcrypt.compare(password, data.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ employeeId: data._id }, process.env.key, {
            expiresIn: 100,
          });

          res.cookie("Token", token);

          res.status(200).json({ message: "Login Sucessfull", token: token });
        } else {
          res.send({ message: "Login Again" });
        }
      });
    } else {
      res.send({ message: "Login Again" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login Again" });
  }
});

// Logout
Erouter.get("/logout", (req, res) => {
  // Clear the token cookie by setting an empty value and expiration in the past
  res.cookie("Token", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { Erouter };
