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

const proyectoSemSchema = new mongoose.Schema({
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
  objetivosEspecificos: [objetivoEspecificoSchema],
});

// Método virtual para calcular el progreso del proyecto
proyectoSemSchema.virtual('progreso').get(function() {
  if (this.objetivosEspecificos.length === 0) return 0;
  
  const objetivosFinalizados = this.objetivosEspecificos.filter(obj => obj.finalizado).length;
  return (objetivosFinalizados / this.objetivosEspecificos.length) * 100;
});



const ProyectoSem = mongoose.model("ProyectoSem", proyectoSemSchema);

module.exports = ProyectoSem;
