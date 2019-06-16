const {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById
} = require("./toolsController");

const {
  createUser,
  updateUser,
  filterUsersByID,
  deleteUsersByID
} = require("./usersController");

module.exports = {
  filterToolsByTag,
  filterToolsById,
  createNewTool,
  updateToolById,
  deleteToolById,
  createUser,
  updateUser,
  filterUsersByID,
  deleteUsersByID
};
