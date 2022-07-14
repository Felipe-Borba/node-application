const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags, user_id } = request.body;

    const movie_id = await knex("movie_notes").insert({
      title,
      user_id,
      description,
      rating,
    });

    const insertTags = tags.map((name) => ({ movie_id, user_id, name }));

    await knex("movie_tags").insert(insertTags);

    return response.status(201).json();
  }

  async show(request, response) {
    const { id } = request.params;

    const movie = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags")
      .where({ movie_id: id })
      .orderBy("name");

    return response.json({ ...movie, tags });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  }

  async list(request, response) {
    const { title, tags, user_id } = request.query;

    let movieNotes;
    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());
      movieNotes = await knex("movie_tags")
        .select([
          "movie_notes.id",
          "movie_notes.title",
          "movie_notes.description",
          "movie_notes.rating",
          "movie_notes.user_id",
          "movie_notes.created_at",
          "movie_notes.updated_at",
        ])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.movie_id")
        .orderBy("movie_notes.title");
    } else {
      movieNotes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const movieTags = await knex("movie_tags").where({ user_id });
    const movieNotesWithTags = movieNotes.map((movieNote) => {
      const tags = movieTags.filter((tag) => tag.movie_id === movieNote.id)

      return {
        ...movieNote,
        tags
      }
    })

    return response.json(movieNotesWithTags);
  }
}

module.exports = MovieNotesController;
