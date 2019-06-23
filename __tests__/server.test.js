require("dotenv").config();
const request = require("supertest");
const server = require("../src/server");
const { databaseURL } = require("../src/config");
const {
  arrayOfTools,
  singleTool,
  defaultUserOne,
  defaultUserTwo,
  userReview,
  adminUser
} = require("../src/helpers/index");
const userOneCredentials = {
  email: defaultUserOne.email,
  password: defaultUserOne.password
};
const userTowCredentials = {
  email: defaultUserTwo.email,
  password: defaultUserTwo.password
};
const adminCredentials = {
  email: adminUser.email,
  password: adminUser.password
};
const { _id, name, email, role } = defaultUserOne;
const { connectDatabase, Tools } = require("../src/database/index");

describe("Server", () => {
  beforeAll(async () => {
    await connectDatabase(databaseURL, "testserver");
    await Tools.insertMany(arrayOfTools);
    await request(server)
      .post("/v1/users/signup")
      .send(adminUser);
    await request(server)
      .post("/v1/users/signup")
      .send(defaultUserTwo);
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

    it("shouldn't create a new tool if the user is not logged in", async () => {
      const resp = await request(server)
        .post("/v1/tools")
        .send(singleTool);
      expect(resp.status).toEqual(401);
    });

    it("should register a new tool if the user is logged in", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const resp = await request(server)
        .post("/v1/tools")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send(singleTool);
      expect(resp.body).toEqual(singleTool);
    });

    it("should update the tool by id if the default user is the creator", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const updatedTool = {
        ...singleTool,
        tags: [...singleTool.tags, "process-manager"]
      };
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec64")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send(updatedTool);
      expect(resp.body).toEqual(updatedTool);
    });

    it("shouldn't update the tool by id if the default user not is the creator", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const updatedTool = {
        ...arrayOfTools[0],
        tags: [...arrayOfTools[0].tags, "process-manager"]
      };
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec65")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send(updatedTool);
      expect(resp.status).toEqual(403);
    });

    it("should update the tool by id if the user role is admin", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(adminCredentials);
      const updatedTool = {
        ...singleTool,
        tags: [...singleTool.tags, "devtools"]
      };
      const resp = await request(server)
        .put("/v1/tools/4ceda7b37085d444ec1bec64")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send(updatedTool);
      expect(resp.body).toEqual(updatedTool);
    });

    it("shouldn't delete the tool by id if user is not logged in", async () => {
      const resp = await request(server).delete(
        "/v1/tools/4ceda7b37085d444ec1bec64"
      );
      expect(resp.status).toEqual(401);
    });

    it("shouldn't delete the tool by id if the default user not is the creator", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const resp = await request(server)
        .delete("/v1/tools/4ceda7b37085d444ec1bec65")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(resp.status).toEqual(403);
    });

    it("should delete the tool by id if the default user is the creator", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const resp = await request(server)
        .delete("/v1/tools/4ceda7b37085d444ec1bec64")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(resp.status).toEqual(200);
    });

    it("should delete the tool by id if the default user role is admin", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(adminCredentials);
      const resp = await request(server)
        .delete("/v1/tools/4ceda7b37085d444ec1bec65")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(resp.status).toEqual(200);
    });
  });

  describe("Users path", () => {
    it("should create a new user", async () => {
      const resp = await request(server)
        .post("/v1/users/signup")
        .send(defaultUserOne);
      expect(resp.body).toEqual({ _id, name, email, role });
    });

    it("should gerate a token", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userOneCredentials);
      expect(typeof login.body.token).toEqual("string");
    });

    it("should filter user by id", async () => {
      const resp = await request(server).get(
        "/v1/users/1ceda7b37085d444ec1bec11"
      );
      expect(resp.body).toEqual({ _id, name, email, role });
    });

    it("shouldn't update if user don't logged in", async () => {
      const updatedUser = {
        ...defaultUserOne,
        name: "user one updated"
      };
      const resp = await request(server)
        .put("/v1/users/1ceda7b37085d444ec1bec11")
        .send(updatedUser);
      expect(resp.status).toEqual(401);
    });

    it("should default user update only your profile", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const updatedUser = {
        ...defaultUserOne,
        name: "user two updated"
      };
      const resp = await request(server)
        .put("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send(updatedUser);
      expect(resp.status).toEqual(403);
    });

    it("should default user update your profile", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userOneCredentials);
      const updatedUser = {
        ...defaultUserOne,
        name: "user one"
      };
      const resp = await request(server)
        .put("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${login.body.token}`)
        .send(updatedUser);
      expect(resp.status).toEqual(200);
    });

    it("shouldn't delete if user don't logged in", async () => {
      const resp = await request(server).delete(
        "/v1/users/1ceda7b37085d444ec1bec11"
      );
      expect(resp.status).toEqual(401);
    });

    it("should default user delete only your profile", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const resp = await request(server)
        .delete("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(resp.status).toEqual(403);
    });

    it("should default user delete your profile", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(userTowCredentials);
      const resp = await request(server)
        .delete("/v1/users/22ceda7b37085d444ec1bec2")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(resp.body).toEqual({});
    });

    it("should admin user delete all profiles", async () => {
      const login = await request(server)
        .post("/v1/users/login")
        .send(adminCredentials);
      const resp = await request(server)
        .delete("/v1/users/1ceda7b37085d444ec1bec11")
        .set("Authorization", `Bearer ${login.body.token}`);
      expect(resp.body).toEqual({});
    });
  });

  describe("Reviews path", () => {
    it("should create a new review", async () => {
      const resp = await request(server)
        .post("/v1/reviews")
        .send(userReview);
      expect(resp.body).toEqual(userReview);
    });

    it("should filter review by id", async () => {
      const resp = await request(server).get(
        "/v1/reviews/9ceda7b37085d444ec1bec99"
      );
      expect(resp.body).toEqual(userReview);
    });

    it("should filter review by user id", async () => {
      const resp = await request(server).get(
        "/v1/reviews/users/1ceda7b37085d444ec1bec11"
      );
      expect(resp.body).toEqual(userReview);
    });

    it("should filter review by tool id", async () => {
      const resp = await request(server).get(
        "/v1/reviews/tools/4ceda7b37085d444ec1bec65"
      );
      expect(resp.body).toEqual(userReview);
    });

    it("should update a existing review by id", async () => {
      const updatedReview = {
        ...userReview,
        comment: "Very cool"
      };
      const resp = await request(server)
        .put("/v1/reviews/9ceda7b37085d444ec1bec99")
        .send(updatedReview);
      expect(resp.body).toEqual(updatedReview);
    });

    it("should delete review by id", async () => {
      const resp = await request(server).delete(
        "/v1/reviews/9ceda7b37085d444ec1bec99"
      );
      expect(resp.body).toEqual({});
    });
  });
});
