require("dotenv").config();
const express = require("express");
const app = express();

const authRouter = require("./routes/authRouter");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api/auth", authRouter);

app.use(errorHandler);

module.exports = app;
