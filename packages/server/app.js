require("dotenv").config();
const express = require("express");
const app = express();

const authRouter = require("./routes/authRouter");

app.use(express.json());
app.use("/api/auth", authRouter);

module.exports = app;
