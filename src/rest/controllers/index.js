const {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById
} = require("./toolsController");

const {
  createUser,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID
} = require("./usersController");

const {
  createReviews,
  updateReviewsByID,
  deleteReviewsByID,
  filterReviewsByID
} = require("./reviewsController");

module.exports = {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById,
  createUser,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID,
  createReviews,
  updateReviewsByID,
  deleteReviewsByID,
  filterReviewsByID
};
