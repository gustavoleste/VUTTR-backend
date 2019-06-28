const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const server = express();
const auth = require("./rest/middlewares/authentication");
const {
  toolsRouter,
  usersRouter,
  reviewsRouter
} = require("./rest/routes/index");

server
  .use(helmet())
  .use(cors())
  .use(express.json())
  .use(auth)
  .use("/v1/tools", toolsRouter)
  .use("/v1/users", usersRouter)
  .use("/v1/reviews", reviewsRouter);

module.exports = server;
