const jwt = require("jsonwebtoken");
const { secretKey } = require("../../config");

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      req.isAuth = false;
      return next();
    }
    const token = header.split(" ")[1];
    if (!token) {
      req.isAuth = false;
      return next();
    }
    const user = jwt.verify(token, secretKey);
    if (!user) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.user = user;
    return next();
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = auth;
