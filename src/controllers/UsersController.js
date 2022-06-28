const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcryptjs");
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
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
    if (!user) {
      throw new AppError("Usuário não encontrado!");
    }

    if (name) {
      user.name = name;
    }

    const userWithEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );
    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new AppError("Esse email já está em uso!");
    }

    if (email) {
      user.email = email;
    }

    if (password && !old_password) {
      throw new AppError("A senha antiga é obrigatória!");
    }

    if (password && old_password) {
      const checkedOldPassword = await compare(old_password, user.password);

      if (!checkedOldPassword) {
        throw new AppError("A senha antiga não confere!");
      } else {
        user.password = await hash(password, 8);
      }
    }

    await database.run(
      `
      UPDATE users SET
      name = (?),
      email = (?),
      updated_at = (?),
      password = (?)
      WHERE id = (?)
      `,
      [user.name, user.email, new Date(), user.password, id]
    );

    return response.json();
  }
}

module.exports = UsersController;
