require("dotenv").config();
const request = require("supertest");
const server = require("../src/server");
const { databaseURL } = require("../src/config");
const {
  arrayOfTools,
  singleTool,
  defaultUser
} = require("../src/helpers/index");
const { connectDatabase, Tools } = require("../src/database/index");

describe("Server", () => {
  beforeAll(async () => {
    await connectDatabase(databaseURL, "testserver");
    await Tools.insertMany(arrayOfTools);
  });

  afterAll(async () => {
    const database = await connectDatabase(databaseURL, "testserver");
    await database.dropDatabase();
  });

  describe("Tools Path", () => {
    it("should list all tools", async () => {
      const resp = await request(server).get("/v1/tools");
      expect(resp.body).toEqual(arrayOfTools);
    });

    it("should filter the tools by id", async () => {
      const resp = await request(server).get(
        "/v1/tools/4ceda7b37085d444ec1bec65"
      );
      expect(resp.body).toEqual([arrayOfTools[0]]);
    });

    it("should filter the tools by tag", async () => {
      const resp = await request(server).get("/v1/tools?tag=node");
      expect(resp.body).toEqual([arrayOfTools[1], arrayOfTools[2]]);
    });

    it("should register a new tool", async () => {
      const resp = await request(server)
        .post("/v1/tools")
        .send(singleTool);
      expect(resp.body).toEqual(singleTool);
    });

    it("should update the tool by id", async () => {
      const updatedTool = {
        ...singleTool,
        tags: [...singleTool.tags, "process-manager"]
      };
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec64")
        .send(updatedTool);
      expect(resp.body).toEqual(updatedTool);
    });

    it("should delete the tool by id", async () => {
      const resp = await request(server).delete(
        "/v1/tools/4ceda7b37085d444ec1bec64"
      );
      expect(resp.body).toEqual({});
    });
  });

  describe("Users path", () => {
    it("should create a new user", async () => {
      const resp = await request(server)
        .post("/v1/users")
        .send(defaultUser);
      expect(resp.body).toEqual(defaultUser);
    });

    it("should filter user by id", async () => {
      const resp = await request(server).get(
        "/v1/users/1ceda7b37085d444ec1bec11"
      );
      expect(resp.body).toEqual(defaultUser);
    });

    it("should update a existing user", async () => {
      const updatedUser = {
        ...defaultUser,
        email: "updatedemail@email.com"
      };
      const resp = await request(server)
        .put("/v1/users/1ceda7b37085d444ec1bec11")
        .send(updatedUser);
      expect(resp.body).toEqual(updatedUser);
    });

    it("should delete user by id", async () => {
      const resp = await request(server).delete(
        "/v1/users/1ceda7b37085d444ec1bec11"
      );
      expect(resp.body).toEqual({});
    });
  });
});
