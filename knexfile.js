const path = require("path");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"), //TODO I think its just fine if remove __dirname
    },
    useNullAsDefault: true,
  },
};
