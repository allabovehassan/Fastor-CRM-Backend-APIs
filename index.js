const express = require("express");
require("dotenv").config();
const app = express();
const { connection } = require("./Config/DB");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const { Erouter } = require("./Routes/Employee_LR_Routes");
const { Crouter } = require("./Routes/Client_Routes");

app.use("/enquiries", Crouter);

app.use("/", Erouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`Connection TO Database Sucessfull`);
  } catch (error) {
    console.log({ message: error.message });
  }
  console.log(`Server is runninng at ${process.env.port}`);
});
