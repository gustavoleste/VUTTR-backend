const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID
} = require("../controllers/index");

router
  .post("/", createUser)
  .put("/:userID", updateUserByID)
  .get("/:userID", filterUsersByID)
  .delete("/:userID", deleteUsersByID);

module.exports = router;
