const { Reviews, connectDatabase } = require("../src/database/index");
const { databaseURLForTest } = require("../src/config");
const { userReview } = require("../src/helpers/index");
require("dotenv").config();

describe("Reviews Model", () => {
  beforeAll(async () => {
    await connectDatabase(databaseURLForTest, "reviewsModelTest");
  });

  afterAll(async () => {
    const database = await connectDatabase(
      databaseURLForTest,
      "reviewsModelTest"
    );
    await database.dropDatabase();
  });

  it("should not create a empty review", async () => {
    try {
      const newReview = new Reviews({});
      await newReview.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a review without the user field set", async () => {
    try {
      const reviewWithoutUserID = { ...userReview, user };
      const newReview = new Reviews(reviewWithoutUserID);
      await newReview.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a review without the tool field set", async () => {
    try {
      const reviewWithoutToolID = { ...userReview, tool };
      const newReview = new Reviews(reviewWithoutToolID);
      await newReview.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should not create a review without the comment field set", async () => {
    try {
      const reviewWithoutComment = { ...userReview, comment };
      const newReview = new Reviews(reviewWithoutComment);
      await newReview.save();
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  it("should create a new review", async () => {
    try {
      const newReview = new Reviews(userReview);
      await newReview.save();
      expect(newReview).toMatchSnapshot();
    } catch (error) {
      console.log(error);
    }
  });
});
