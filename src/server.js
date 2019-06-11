const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const server = express();

const helloWorld = (req, res) => res.status(200).json({ msg: "Hello Wolrd!" });

server
  .use(helmet())
  .use(cors())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use("/", helloWorld);

module.exports = server;
