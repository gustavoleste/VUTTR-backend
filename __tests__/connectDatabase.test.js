const { connectDatabase } = require("../src/database/index");
const { databaseURL } = require("../src/config");
require("dotenv").config();

describe("Database", () => {
  it("should connect to the database successfully", async () => {
    const res = await connectDatabase(databaseURL, "testDatabaseConnection");
    const isOpen = res._hasOpened;
    await res.db._events.close();
    expect(isOpen).toBe(true);
  });
});
