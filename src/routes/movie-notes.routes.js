const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");

const movieNotesRoutes = Router();
const movieNotesController = new MovieNotesController();

movieNotesRoutes.get("/", movieNotesController.list);
movieNotesRoutes.post("/", movieNotesController.create);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.delete("/:id", movieNotesController.delete);

module.exports = movieNotesRoutes;
