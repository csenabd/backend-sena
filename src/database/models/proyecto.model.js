const mongoose = require("mongoose");
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

const objetivoEspecificoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  finalizado: {
    type: Boolean,
    default: false,
  },
  actividades: [actividadesSchema]
});



const proyectoSchema = new mongoose.Schema({
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
    type: String
  },
  objetivoGeneral: {
    type: String,
    required: true,
  },
  objetivosEspecificos: [objetivoEspecificoSchema],
});

// Método virtual para calcular el progreso del proyecto
proyectoSchema.virtual('progreso').get(function() {
  if (this.objetivosEspecificos.length === 0) return 0;
  
  const objetivosFinalizados = this.objetivosEspecificos.filter(obj => obj.finalizado).length;
  return (objetivosFinalizados / this.objetivosEspecificos.length) * 100;
});

const Proyecto = mongoose.model("proyecto", proyectoSchema);

module.exports = Proyecto;