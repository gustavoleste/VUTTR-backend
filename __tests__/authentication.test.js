require("dotenv").config();
const authentication = require("../src/rest/middlewares/authentication");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../src/config");
const { defaultUserOne } = require("../src/helpers/index");
const { _id, role } = defaultUserOne;
const token = jwt.sign(
  {
    id: _id,
    role
  },
  secretKey,
  {
    expiresIn: "1h"
  }
);

describe("Authentication Middleware", () => {
  it("should return isAth equal to false if the authentication header is empty", () => {
    const req = { headers: "" };
    const res = {};
    const next = () => req.isAuth;
    const result = authentication(req, res, next);
    expect(result).toBeFalsy();
  });

  it("should return isAuth header equal to true if token is valid", () => {
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = () => req.isAuth;
    const result = authentication(req, res, next);
    expect(result).toBeTruthy();
  });
});
