const { Router } = require("express");
const MovieTagsController = require("../controllers/MovieTagsController");

const movieTagsRoutes = Router();
const movieTagsController = new MovieTagsController();

movieTagsRoutes.get("/", movieTagsController.list);

module.exports = movieTagsRoutes;
