require("dotenv").config();

const databaseURL = process.env.DATABASE_ADDRESS;
const PORT = process.env.PORT;
const secretKey = process.env.SECRET_KEY;

module.exports = {
  databaseURL,
  PORT,
  secretKey
};
