const fichaService = require("../services/ficha.service");
class fichaController {
  constructor() {
    this.service = new fichaService();
  }
  async index() {
    const fichas = await this.service.get();
    return fichas;
  }
  async create(ficha) {
    const fichas = await this.service.post(ficha);
    return fichas;
  }
  async getById(id) {
    const ficha = await this.service.getOne(id);
    return ficha;
  }
  async remove(id) {
    const ficha = await this.service.delete(id);
    return ficha;
  }
  async update(id, values) {
    const ficha = await this.service.update(id, values);
    return ficha;
  }
}
module.exports = fichaController;
