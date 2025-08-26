const mongoose = require("mongoose");

// Definición de esquema de actividades
const actividadesSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  finalizado: {
    type: Boolean,
    default: false,
  },
  resultado: [
    {
      nombreArchivo: String,
      rutaArchivo: Array,
      tipoArchivo: String,
    },
  ],
});

// Definición de esquema de objetivos específicos
const objetivoEspecificoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  finalizado: {
    type: Boolean,
    default: false,
  },
  actividades: [actividadesSchema],
});

// Esquema del proyecto
const proyectoSenoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  autores: {
    type: String,
  },
  ficha: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ficha",
    },
  ],
  fecha: {
    type: String,
    required: true,
  },
  documentacion: {
    type: Array,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagenes: {
    type: Array,
    required: true,
  },
  video: {
    type: Array,
  },
  confirmationCode: {
    type: String,
  },
  objetivoGeneral: {
    type: String,
    required: true,
  },
  objetivosEspecificos: [objetivoEspecificoSchema],
});

// Método virtual para calcular el progreso del proyecto
proyectoSenoSchema.virtual('progreso').get(function() {
  if (this.objetivosEspecificos.length === 0) return 0;

  const objetivosFinalizados = this.objetivosEspecificos.filter(obj => obj.finalizado).length;
  return (objetivosFinalizados / this.objetivosEspecificos.length) * 100;
});

const ProyectoSeno = mongoose.model("proyectoSeno", proyectoSenoSchema);

module.exports = ProyectoSeno;
