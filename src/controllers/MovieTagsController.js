const knex = require("../database/knex");

class MovieTagsController {
  async list(request, response) {
    const { user_id } = request.query;

    const movieTags = await knex("movie_tags").where({ user_id });

    return response.json(movieTags);
  }
}

module.exports = MovieTagsController;
