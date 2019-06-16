const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const server = express();
const { toolsRouter, usersRouter } = require("./rest/routes/index");

server
  .use(helmet())
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use("/v1/tools", toolsRouter)
  .use("/v1/users", usersRouter);

module.exports = server;
