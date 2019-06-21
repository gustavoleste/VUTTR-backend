const { Users, connectDatabase } = require("../src/database/index");
const { databaseURL } = require("../src/config");
const { defaultUserOne } = require("../src/helpers/index");
require("dotenv").config();

describe("Users Model", () => {
  beforeAll(async () => {
    await connectDatabase(databaseURL, "usersModelTest");
  });

  afterAll(async () => {
    const database = await connectDatabase(databaseURL, "usersModelTest");
    await database.dropDatabase();
  });

  it("should not create a empty user", async () => {
    try {
      const newUser = new Users({});
      await newUser.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a user without the name field set", async () => {
    try {
      const userWithoutName = { ...defaultUserOne, name };
      const newUser = new Users(userWithoutName);
      await newUser.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a user without the email field set", async () => {
    try {
      const userWithoutEmail = { ...defaultUserOne, email };
      const newUser = new Users(userWithoutEmail);
      await newUser.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a user without the password field set", async () => {
    try {
      const userWithoutPassword = { ...defaultUserOne, password };
      const newUser = new Users(userWithoutPassword);
      await newUser.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should create a new user", async () => {
    try {
      const newUser = new Users(defaultUserOne);
      await newUser.save();
      expect(newUser).toMatchSnapshot();
    } catch (error) {
      console.log(error);
    }
  });
});
