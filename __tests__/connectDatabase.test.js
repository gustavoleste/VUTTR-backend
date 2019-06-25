const { connectDatabase } = require("../src/database/index");
const { databaseURLForTest } = require("../src/config");
require("dotenv").config();

describe("Database", () => {
  it("should connect to the database successfully", async () => {
    const res = await connectDatabase(
      databaseURLForTest,
      "testDatabaseConnection"
    );
    const isOpen = res._hasOpened;
    await res.db._events.close();
    expect(isOpen).toBe(true);
  });
});
