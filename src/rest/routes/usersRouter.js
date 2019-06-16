const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  filterUsersByID,
  deleteUsersByID
} = require("../controllers/index");

router
  .post("/", createUser)
  .put("/:userID", updateUser)
  .get("/:userID", filterUsersByID)
  .delete("/:userID", deleteUsersByID);

module.exports = router;
