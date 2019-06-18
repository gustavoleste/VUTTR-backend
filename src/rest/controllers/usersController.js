const { Users } = require("../../database/index");

const createUser = async (req, res) => {
  try {
    const newUser = await new Users({ ...req.body });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    throw err;
  }
};

const updateUserByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const updatedUser = { ...req.body };
    await Users.updateOne({ _id: id }, updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    throw err;
  }
};

const filterUsersByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const user = await Users.findOne({ _id: id });
    res.status(200).json(user);
  } catch (err) {
    throw err;
  }
};

const deleteUsersByID = async (req, res) => {
  try {
    const id = req.params.userID;
    await Users.deleteOne({ _id: id });
    res.status(200).json({});
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID
};
