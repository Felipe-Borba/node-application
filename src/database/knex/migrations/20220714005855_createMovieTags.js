/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists("movie_tags", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table.integer("user_id").references("id").inTable("users");
    table
      .integer("movie_id")
      .references("id")
      .inTable("movie_notes")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("movie_tags");
};
