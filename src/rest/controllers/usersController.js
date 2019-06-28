const { Users } = require("../../database/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../../config");

const signup = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    const newUser = await new Users({ ...req.body, password });
    await newUser.save();
    delete newUser._doc.password;
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const updateUserByID = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const user = await Users.findOne({ _id: req.params.userID });
    if (req.user.id == user._id || req.user.role === "admin") {
      const updatedUser = Object.assign(user, { ...req.body });
      await Users.updateOne({ _id: req.params.userID }, updatedUser);
      delete updatedUser._doc.password;
      return res.status(200).json(updatedUser);
    }
    return res.status(403).json({ msg: "Access not allowed" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const filterUsersByID = async (req, res) => {
  try {
    const id = req.params.userID;
    const user = await Users.findOne({ _id: id });
    delete user._doc.password;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const deleteUsersByID = async (req, res) => {
  try {
    if (!req.isAuth) {
      return res.status(401).json({ message: "Not Authenticate." });
    }
    const user = await Users.findOne({ _id: req.params.userID });
    if (req.user.id == user._id || req.user.role === "admin") {
      await Users.deleteOne({ _id: req.params.userID });
      return res.status(200).json({});
    }
    return res.status(403).json({ msg: "Access not allowed" });
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
