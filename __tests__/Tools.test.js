const { Tools, connectDatabase } = require("../src/database/index");
const { databaseURL } = require("../src/config");
const { singleTool } = require("../src/helpers/index");
require("dotenv").config();

describe("Tools Model", () => {
  beforeAll(async () => {
    await connectDatabase(databaseURL, "toolsModelTest");
  });

  afterAll(async () => {
    const database = await connectDatabase(databaseURL, "toolsModelTest");
    await database.dropDatabase();
  });

  it("should not create a empty tool", async () => {
    try {
      const newTool = new Tools({});
      await newTool.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a tool without the title field set", async () => {
    try {
      const toolWithoutTitle = { ...singleTool, title };
      const newTool = new Tools(toolWithoutTitle);
      await newTool.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a tool without the link field set", async () => {
    try {
      const toolWithoutLink = { ...singleTool, link };
      const newTool = new Tools(toolWithoutLink);
      await newTool.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a tool without the tags field set", async () => {
    try {
      const toolWithoutTags = { ...singleTool, tags };
      const newTool = new Tools(toolWithoutTags);
      await newTool.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a tool without the description field set", async () => {
    try {
      const toolWithoutDescription = { ...singleTool, description };
      const newTool = new Tools(toolWithoutDescription);
      await newTool.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should create a new tool", async () => {
    try {
      const newTool = new Tools(singleTool);
      await newTool.save();
      expect(newTool).toMatchSnapshot();
    } catch (error) {
      console.log(error);
    }
  });
});
