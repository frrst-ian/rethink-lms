require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";

const getAllowedOrigins = () => {
    if (NODE_ENV === "development") {
        return ["http://localhost:5173", "http://localhost:5174"];
    }
    return ["https://odinbookxd.netlify.app"];
};

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            const allowedOrigins = getAllowedOrigins();

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
        optionsSuccessStatus: 200,
    }),
);


const authRouter = require("./routes/authRouter");
const courseRouter = require("./routes/courseRouter");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);

app.use(errorHandler);

module.exports = app;
