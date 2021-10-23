require("dotenv").config();
require("express-async-errors");
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

// parser
app.use(express.json());
//basic end points
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobAuth, jobRoutes);
//middleware for route-error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
// spinupthe server
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
