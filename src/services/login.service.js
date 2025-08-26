const loginSchema = require("../database/models/login.model");

class LoginService {
  constructor() {
    this.model = loginSchema;
  }

  async get() {
    const users = await this.model
      .find()
      .populate("rol")
      .populate("ficha")
      .populate("gestor");
    return users;
  }

  async post(login) {
    const user = await this.model.create(login);
    return user;
  }

  async getOne(id) {
    const user = await this.model
      .findById(id)
      .populate("rol")
      .populate("ficha")
      .populate("gestor");
    if (!user) return null;
    // Convertir rol y ficha a string (solo el primero si existen)
    const userObj = user.toObject();
    userObj.rol = userObj.rol && userObj.rol.length > 0 ? userObj.rol[0]._id.toString() : null;
    userObj.ficha = userObj.ficha && userObj.ficha.length > 0 ? userObj.ficha[0]._id.toString() : null;
    return userObj;
  }

  async delete(id) {
    const user = await this.model.findByIdAndDelete(id);
    return user;
  }

  async update(id, values) {
    const user = await this.model
      .findByIdAndUpdate(id, values, { new: true })
      .populate("rol")
      .populate("ficha")
      .populate("gestor");
    if (!user) return null;
    const userObj = user.toObject();
    userObj.rol = userObj.rol && userObj.rol.length > 0 ? userObj.rol[0]._id.toString() : null;
    userObj.ficha = userObj.ficha && userObj.ficha.length > 0 ? userObj.ficha[0]._id.toString() : null;
    return userObj;
  }
  async validateUser(email) {
    const user = await this.model.findOne({ email });
    return user;
  }
}

module.exports = LoginService;
