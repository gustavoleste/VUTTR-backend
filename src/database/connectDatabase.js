const mongoose = require("mongoose");

const connect = async (databaseURL, databaseName) => {
  try {
    const database = await mongoose.connect(`${databaseURL}${databaseName}`, {
      useCreateIndex: true,
      useNewUrlParser: true
    });
    return database.connections[0];
  } catch (err) {
    throw err;
  }
};

module.exports = connect;
