const express = require("express");
const router = express.Router();
const {
  createReviews,
  updateReviewsByID,
  filterReviewsByID,
  deleteReviewsByID
} = require("../controllers/index");

router
  .post("/", createReviews)
  .put("/:reviewID", updateReviewsByID)
  .get("/:reviewID", filterReviewsByID)
  .get("/users/:userID", filterReviewsByID)
  .get("/tools/:toolID", filterReviewsByID)
  .delete("/:reviewID", deleteReviewsByID);

module.exports = router;
