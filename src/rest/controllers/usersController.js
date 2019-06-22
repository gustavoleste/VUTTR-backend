const { Users } = require("../../database/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../../config");

const signup = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    const newUser = await new Users({ ...req.body, password });
    await newUser.save();
    const { _id, name, email, role } = newUser;
    return res.status(201).json({ _id, name, email, role });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const updateUserByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const updatedUser = { ...req.body };
    await Users.updateOne({ _id: id }, updatedUser);
    const { _id, name, email, role } = updatedUser;
    return res.status(200).json({ _id, name, email, role });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const filterUsersByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const user = await Users.findOne({ _id: id });
    const { _id, name, email, role } = user;
    return res.status(200).json({ _id, name, email, role });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const deleteUsersByID = async (req, res) => {
  try {
    const id = req.params.userID;
    await Users.deleteOne({ _id: id });
    return res.status(200).json({});
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const login = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credencials" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credencials" });
    }
    const token = await jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      secretKey,
      {
        expiresIn: "1h"
      }
    );
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = {
  signup,
  updateUserByID,
  filterUsersByID,
  deleteUsersByID,
  login
};
