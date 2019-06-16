const express = require("express");
const router = express.Router();
const {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById
} = require("../controllers/index");

router
  .get("/", filterToolsByTag)
  .get("/:toolID", filterToolsById)
  .post("/", createNewTool)
  .put("/:toolID", updateToolById)
  .delete("/:toolID", deleteToolById);

module.exports = router;
