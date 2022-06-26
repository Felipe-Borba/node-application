const AppError = require("../utils/AppError");

class UsersController {
  create(request, response) {
    const { name, email, password } = request.body;

    if(!name) {
      throw new AppError("nome é obrigatório!")
    }

    response.json({ ok: true, name, email, password });
  }
}

module.exports = UsersController;
