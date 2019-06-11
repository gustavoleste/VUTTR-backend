require("dotenv").config();
const request = require("supertest");
const server = require("../src/server");

describe("Server", () => {
  describe("Test the root path", () => {
    it("should response the GET method", async () => {
      const response = await request(server).get("/");
      expect(response.statusCode).toBe(200);
    });
  });
});
