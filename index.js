const server = require("./src/server");
const { databaseURL } = require("./src/config");
const { connectDatabase } = require("./src/database/index");
connectDatabase(databaseURL, "vuttr");

server.listen(3000, () => console.log("OK"));
