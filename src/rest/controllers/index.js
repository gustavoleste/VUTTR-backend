const {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById
} = require("./toolsController");

const {
  signup,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID,
  login
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
  signup,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID,
  login,
  createReviews,
  updateReviewsByID,
  deleteReviewsByID,
  filterReviewsByID
};
