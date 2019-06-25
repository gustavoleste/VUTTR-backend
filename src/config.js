require("dotenv").config();

const databaseURL = process.env.DATABASE_ADDRESS;
const databaseURLForTest = process.env.DATABASE_ADDRESS_TEST;
const PORT = process.env.PORT;
const secretKey = process.env.SECRET_KEY;

module.exports = {
  databaseURL,
  databaseURLForTest,
  PORT,
  secretKey
};
