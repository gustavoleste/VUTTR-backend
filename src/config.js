require("dotenv").config();

const databaseURL = process.env.DATABASE_ADDRESS;
const PORT = process.env.PORT;

module.exports = {
  databaseURL,
  PORT
};
