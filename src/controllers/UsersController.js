const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash } = require("bcryptjs");
const usersRoutes = require("../routes/users.routes");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso!");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    const userWithEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new AppError("Esse email já está em uso!");
    }

    await database.run(
      `
      UPDATE users SET
      name = (?),
      email = (?),
      updated_at = (?)
      WHERE id = (?)
      `,
      [name, email, new Date(), id]
    );

    return response.json();
  }
}

module.exports = UsersController;
