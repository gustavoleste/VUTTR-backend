require("dotenv").config();
const request = require("supertest");
const server = require("../src/server");
const { databaseURLForTest } = require("../src/config");
const {
  arrayOfTools,
  singleTool,
  defaultUserOne,
  defaultUserTwo,
  defaultUserThree,
  userReview,
  adminUser,
  login
} = require("../src/helpers/index");
const { connectDatabase, Tools } = require("../src/database/index");

let adminToken;
let userOneToken;
let userTwoToken;

describe("Server", () => {
  beforeAll(async () => {
    await connectDatabase(databaseURLForTest, "testserver");
    await Tools.insertMany(arrayOfTools);
    adminToken = await login(server, adminUser);
    userOneToken = await login(server, defaultUserOne);
    userTwoToken = await login(server, defaultUserTwo);
  });

  afterAll(async () => {
    const database = await connectDatabase(databaseURLForTest, "testserver");
    await database.dropDatabase();
  });

  describe("Tools Path", () => {
    const updatedTool = {
      ...singleTool,
      tags: [...singleTool.tags, "process-manager"]
    };

    it("should list all tools", async () => {
      const resp = await request(server).get("/v1/tools");
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual(arrayOfTools);
    });

    it("should filter the tools by id", async () => {
      const resp = await request(server).get(
        "/v1/tools/4ceda7b37085d444ec1bec65"
      );
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual([arrayOfTools[0]]);
    });

    it("should filter the tools by tag", async () => {
      const resp = await request(server).get("/v1/tools?tag=node");
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual([arrayOfTools[1], arrayOfTools[2]]);
    });

    it("shouldn't create a new tool if the user don't logged in", async () => {
      const resp = await request(server)
        .post("/v1/tools")
        .send(singleTool);
      expect(resp.status).toEqual(401);
    });

    it("should register a new tool if the user is logged in", async () => {
      const resp = await request(server)
        .post("/v1/tools")
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send(singleTool);
      expect(resp.status).toEqual(201);
      expect(resp.body).toEqual(singleTool);
    });

    it("should update the tool by id if the default user is the creator", async () => {
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec64")
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send(updatedTool);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual(updatedTool);
    });

    it("shouldn't update the tool by id if the default user not is the creator", async () => {
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec65")
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send(updatedTool);
      expect(resp.status).toEqual(403);
    });

    it("should update the tool by id if the user role is admin", async () => {
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec64")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatedTool);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual(updatedTool);
    });

    it("shouldn't delete the tool by id if user is not logged in", async () => {
      const resp = await request(server).delete(
        "/v1/tools/4ceda7b37085d444ec1bec64"
      );
      expect(resp.status).toEqual(401);
    });

    it("shouldn't delete the tool by id if the default user not is the creator", async () => {
      const resp = await request(server)
        .delete("/v1/tools/4ceda7b37085d444ec1bec65")
        .set("Authorization", `Bearer ${userTwoToken}`);
      expect(resp.status).toEqual(403);
    });

    it("should delete the tool by id if the default user is the creator", async () => {
      const resp = await request(server)
        .delete("/v1/tools/4ceda7b37085d444ec1bec64")
        .set("Authorization", `Bearer ${userTwoToken}`);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual({});
    });

    it("should delete the tool by id if the default user role is admin", async () => {
      const resp = await request(server)
        .delete("/v1/tools/4ceda7b37085d444ec1bec65")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual({});
    });
  });

  describe("Reviews path", () => {
    const updatedReview = {
      ...userReview,
      comment: "Very cool"
    };
    it("should create a new review", async () => {
      const resp = await request(server)
        .post("/v1/reviews")
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send(userReview);
      expect(resp.status).toEqual(201);
      expect(resp.body).toEqual(userReview);
    });

    it("should filter review by id", async () => {
      const resp = await request(server).get(
        "/v1/reviews/9ceda7b37085d444ec1bec99"
      );
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual([userReview]);
    });

    it("should filter review by user id", async () => {
      const resp = await request(server).get(
        "/v1/reviews/users/22ceda7b37085d444ec1bec2"
      );
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual([userReview]);
    });

    it("should filter review by tool id", async () => {
      const resp = await request(server).get(
        "/v1/reviews/tools/4ceda7b37085d444ec1bec65"
      );
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual([userReview]);
    });

    it("shouldn't update review if user don't logged in", async () => {
      const resp = await request(server)
        .put("/v1/reviews/9ceda7b37085d444ec1bec99")
        .send(updatedReview);
      expect(resp.status).toEqual(401);
    });

    it("should default user update only your reviews", async () => {
      const resp = await request(server)
        .put("/v1/reviews/9ceda7b37085d444ec1bec99")
        .set("Authorization", `Bearer ${userOneToken}`)
        .send(updatedReview);
      expect(resp.status).toEqual(403);
    });

    it("should default user update your reviews", async () => {
      const resp = await request(server)
        .put("/v1/reviews/9ceda7b37085d444ec1bec99")
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send(updatedReview);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual(updatedReview);
    });

    it("should default user delete only your reviews", async () => {
      const resp = await request(server)
        .delete("/v1/reviews/9ceda7b37085d444ec1bec99")
        .set("Authorization", `Bearer ${userOneToken}`);
      expect(resp.status).toEqual(403);
    });

    it("should delete review by id", async () => {
      const resp = await request(server)
        .delete("/v1/reviews/9ceda7b37085d444ec1bec99")
        .set("Authorization", `Bearer ${userTwoToken}`);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual({});
    });
  });

  describe("Users path", () => {
    const userThree = { ...defaultUserThree };
    delete userThree.password;
    const updatedUser = {
      ...defaultUserOne,
      name: "user one"
    };
    const userOne = { ...updatedUser };
    delete userOne.password;

    it("should create a new user", async () => {
      const resp = await request(server)
        .post("/v1/users/signup")
        .send(defaultUserThree);
      expect(resp.status).toEqual(201);
      expect(resp.body).toEqual(userThree);
    });

    it("should gerate a token", async () => {
      const resp = await request(server)
        .post("/v1/users/login")
        .send(defaultUserThree);
      expect(resp.status).toEqual(200);
      expect(typeof resp.body.token).toEqual("string");
    });

    it("should filter user by id", async () => {
      const resp = await request(server).get(
        "/v1/users/33ceda7b37085d444ec1bec3"
      );
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual(userThree);
    });

    it("shouldn't update if user don't logged in", async () => {
      const resp = await request(server)
        .put("/v1/users/33ceda7b37085d444ec1bec3")
        .send(updatedUser);
      expect(resp.status).toEqual(401);
    });

    it("should default user update only your profile", async () => {
      const resp = await request(server)
        .put("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${userTwoToken}`)
        .send(updatedUser);
      expect(resp.status).toEqual(403);
    });

    it("should default user update your profile", async () => {
      const resp = await request(server)
        .put("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${userOneToken}`)
        .send(updatedUser);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual(userOne);
    });

    it("shouldn't delete if user don't logged in", async () => {
      const resp = await request(server).delete(
        "/v1/users/1ceda7b37085d444ec1bec11"
      );
      expect(resp.status).toEqual(401);
    });

    it("should default user delete only your profile", async () => {
      const resp = await request(server)
        .delete("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${userTwoToken}`);
      expect(resp.status).toEqual(403);
    });

    it("should default user delete your profile", async () => {
      const resp = await request(server)
        .delete("/v1/users/22ceda7b37085d444ec1bec2")
        .set("Authorization", `Bearer ${userTwoToken}`);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual({});
    });

    it("should admin user delete all profiles", async () => {
      const resp = await request(server)
        .delete("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(resp.status).toEqual(200);
      expect(resp.body).toEqual({});
    });
  });
});
