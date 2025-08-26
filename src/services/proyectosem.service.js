const proyectoSemSchema = require("../database/models/proyectosem.model");

class ProyectoSemService {
  constructor() {
    this.model = proyectoSemSchema;
  }
  async get() {
    const proyectos = await this.model.find().populate("ficha");
    return proyectos;
  }
  async post(proyecto) {
    const proyectos = await this.model.create(proyecto);
    return proyectos;
  }
  async getOne(id) {
    const proyecto = await this.model.findById(id).populate("ficha");
    return proyecto;
  }
  async delete(id) {
    const proyecto = await this.model.findByIdAndDelete(id);
    return proyecto;
  }
  async update(id, values) {
    const proyecto = await this.model.findByIdAndUpdate(id, values);
    return proyecto;
  }
  async updateObjetivoEspecifico(id, objetivoId, finalizado, resultado) {
    const proyecto = await this.model.findOneAndUpdate(
      { _id: id, "objetivosEspecificos._id": objetivoId },
      { $set: { "objetivosEspecificos.$.finalizado": finalizado } },
      { $set: { "objetivosEspecificos.$.resultado": resultado } },
      { new: true }
    );
    return proyecto;
  }

  async getProgreso(id) {
    const proyecto = await this.model.findById(id);
    if (!proyecto) return null;
    
    return proyecto.progreso;
  }

  async addActividad(id, objetivoId, actividad) {
    const proyecto = await this.model.findOneAndUpdate(
      { _id: id, "objetivosEspecificos._id": objetivoId },
      { $push: { "objetivosEspecificos.$.actividades": actividad } },
      { new: true }
    );
    return proyecto;
  }

  // service/proyecto.service.js

// service/proyecto.service.js

// service/proyecto.service.js

// service/proyecto.service.js

// service/proyecto.service.js

async updateActividad(id, objetivoId, actividadId, finalizado, resultado = []) {


  // Obtenemos el proyecto actual para acceder a los archivos existentes
  const proyecto = await this.model.findOne({
    _id: id,
    "objetivosEspecificos._id": objetivoId,
    "objetivosEspecificos.actividades._id": actividadId
  });

  if (!proyecto) {
    console.error("No se encontró el proyecto o la actualización falló");
    throw new Error("No se encontró el proyecto o la actualización falló");
  }

  // Obtener el objetivo y la actividad específica
  const objetivo = proyecto.objetivosEspecificos.id(objetivoId);
  const actividad = objetivo.actividades.id(actividadId);

  if (!actividad) {
    console.error("Actividad no encontrada dentro del proyecto");
    throw new Error("Actividad no encontrada dentro del proyecto");
  }

  // Si no hay nuevos archivos, mantenemos los existentes
  if (resultado.length === 0) {
    resultado = actividad.resultado;
  }

  // Actualizamos la actividad
  actividad.finalizado = finalizado;
  actividad.resultado = resultado;

  // Guardamos los cambios
  await proyecto.save();

  // Verificamos si todas las actividades del objetivo están finalizadas
  if (objetivo.actividades.every(act => act.finalizado)) {
    objetivo.finalizado = true;
    await proyecto.save();
  }

  return proyecto;
}


  async deleteActividad(id, objetivoId, actividadId) {
    const proyecto = await this.model.findOneAndUpdate(
      { _id: id, "objetivosEspecificos._id": objetivoId },
      { $pull: { "objetivosEspecificos.$.actividades": { _id: actividadId } } },
      { new: true }
    );
    return proyecto;
  }

}
module.exports = ProyectoSemService;
