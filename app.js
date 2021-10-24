require("dotenv").config();
require("express-async-errors");
//Security Packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
//db import
const connectDb = require("./db/connect");
const jobAuth = require("./middleware/authentication");
//routes import
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
// error handlers import
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //Limit each IP to 100 request per WindowMs
  })
);

// parser
//basic end points
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobAuth, jobRoutes);
//middleware for route-error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
// spin-up the server
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
