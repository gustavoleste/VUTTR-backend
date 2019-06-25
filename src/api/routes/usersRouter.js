const express = require("express");
const router = express.Router();
const {
  signup,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID,
  login
} = require("../controllers/index");

router
  .post("/signup", signup)
  .post("/login", login)
  .put("/:userID", updateUserByID)
  .get("/:userID", filterUsersByID)
  .delete("/:userID", deleteUsersByID);

module.exports = router;
