const request = require("supertest");
const login = async (server, user) => {
  await request(server)
    .post("/v1/users/signup")
    .send(user);
  const response = await request(server)
    .post("/v1/users/login")
    .send({ email: user.email, password: user.password });
  const token = response.body.token;
  return token;
};

module.exports = login;
