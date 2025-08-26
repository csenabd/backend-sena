const mongoose = require("mongoose");

const gestorSchema = new mongoose.Schema({
  nombre: {
    type: String,
  },
  documento: {
    type: String,
    //opcional evitar registro doble
    //unique: true,
  },
  celular: {
    type: String,
  },
  correo: {
    type: String,
    //opcional
    unique: true,
  }
});

const Gestor = mongoose.model("gestor", gestorSchema);

module.exports = Gestor;
