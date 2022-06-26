const { Router, response } = require("express");

const usersRoutes = Router();

usersRoutes.get("/", (request, response) => {
  response.json({ ok: true });
});

module.exports = usersRoutes;
