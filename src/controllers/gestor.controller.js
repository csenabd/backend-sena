const gestorService = require("../services/gestor.service");
class gestorController {
  constructor() {
    this.service = new gestorService();
  }
  async index() {
    const gestor = await this.service.get();
    return gestor;
  }
  async create(gestor) {
    const gestors = await this.service.post(gestor);
    return gestors;
  }
  async getById(id) {
    const gestor = await this.service.getOne(id);
    return gestor;
  }
  async remove(id) {
    const gestor = await this.service.delete(id);
    return gestor;
  }
  async update(id, values) {
    const gestor = await this.service.update(id, values);
    return gestor;
  }
}
module.exports = gestorController;
