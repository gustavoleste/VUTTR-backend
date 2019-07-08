const server = require("./src/server");
const { databaseURL, PORT } = require("./src/config");
const { connectDatabase } = require("./src/database/index");
connectDatabase(databaseURL, "vuttr");

server.listen(PORT, () => console.log("OK"));
