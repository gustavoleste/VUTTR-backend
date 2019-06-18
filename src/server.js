const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const server = express();
const {
  toolsRouter,
  usersRouter,
  reviewsRouter
} = require("./rest/routes/index");

server
  .use(helmet())
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use("/v1/tools", toolsRouter)
  .use("/v1/users", usersRouter)
  .use("/v1/reviews", reviewsRouter);

module.exports = server;
