const fichaSchema = require("../database/models/ficha.model");

class fichaService {
  constructor() {
    this.model = fichaSchema;
  }
  async get() {
    const fichas = await this.model.find()
    return fichas;
  }
  async post(ficha) {
    const fichas = await this.model.create(ficha);
    return fichas;
  }
  async getOne(id) {
    const ficha = await this.model.findById(id)
    return ficha;
  }
  async delete(id) {
    const ficha = await this.model.findByIdAndDelete(id);
    return ficha;
  }
  async update(id, values) {
    const ficha = await this.model.findByIdAndUpdate(id, values);
    return ficha;
  }
}
module.exports = fichaService;
