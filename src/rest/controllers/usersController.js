const { Users } = require("../../database/index");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    const newUser = await new Users({ ...req.body, password });
    await newUser.save();
    const { _id, name, email, role } = newUser;
    res.status(201).json({ _id, name, email, role });
  } catch (err) {
    throw err;
  }
};

const updateUserByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const updatedUser = { ...req.body };
    await Users.updateOne({ _id: id }, updatedUser);
    const { _id, name, email, role } = updatedUser;
    res.status(200).json({ _id, name, email, role });
  } catch (err) {
    throw err;
  }
};

const filterUsersByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const user = await Users.findOne({ _id: id });
    const { _id, name, email, role } = user;
    res.status(200).json({ _id, name, email, role });
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
