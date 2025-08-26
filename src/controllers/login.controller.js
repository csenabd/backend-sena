const LoginService = require("../services/login.service");
const generateAcessToken = require("../function/jwt/createToken");
const bcrypt = require("bcrypt");
class LoginController {
  constructor() {
    this.service = new LoginService();
  }

  async index() {
    const users = await this.service.get();
    return users;
  }

  async create(login) {
    const user = await this.service.post(login);
    return user;
  }

  async getOne(id) {
    const user = await this.service.getOne(id);
    return user;
  }

  async delete(id) {
    const user = await this.service.delete(id);
    return user;
  }

  async update(id, values) {
    const user = await this.service.update(id, values);
    return user;
  }
  async validateUser(email, password) {
    const user = await this.service.validateUser(email);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAcessToken(user);
        return { accessToken, user };
      } else {
        throw new Error("Contraseña incorrecta");
      }
    } else {
      throw new Error("Usuario no registrado");
    }
  }
}
module.exports = LoginController;
