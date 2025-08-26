const ProyectoSemService = require("../services/proyectosem.service");
const { hostback } = require("../config/config");

class ProyectoSemController {
  constructor() {
    this.service = new ProyectoSemService();
  }

  async index() {
    const proyecto = await this.service.get();
    return proyecto;
  }

  async create(proyecto) {
    const proyectos = await this.service.post(proyecto);
    return proyectos;
  }

  async getById(id) {
    const proyecto = await this.service.getOne(id);
    return proyecto;
  }

  async remove(id) {
    const proyecto = await this.service.delete(id);
    return proyecto;
  }

  async update(id, values) {
    const proyecto = await this.service.update(id, values);
    return proyecto;
  }

  async updateObjetivoEspecifico(id, objetivoId, finalizado) {
    const proyecto = await this.service.updateObjetivoEspecifico(id, objetivoId, finalizado);
    return proyecto;
  }

  async getProgreso(id) {
    const progreso = await this.service.getProgreso(id);
    return progreso;
  }
  async addActividad(id, objetivoId, actividad) {
    const proyecto = await this.service.addActividad(id, objetivoId, actividad);
    return proyecto;
  }

  // controller/proyecto.controller.js

// controller/proyecto.controller.js

// controller/proyecto.controller.js

async updateActividad(id, objetivoId, actividadId, finalizado, archivos = []) {
  let resultados = [];

  // Solo procesamos los archivos si existen
  if (archivos.length > 0) {


    resultados = archivos.map((archivo) => ({
      nombreArchivo: archivo.originalname,
      rutaArchivo: `${hostback}/${archivo.filename}`,
      tipoArchivo: archivo.mimetype,
      
    }));

  } else {
    console.log("No se recibieron archivos para la actividad.");
    
  }

  try {
    const proyecto = await this.service.updateActividad(
      id,
      objetivoId,
      actividadId,
      finalizado,
      resultados
    );


    
    return proyecto;
  } catch (error) {
    console.error("Error en el controlador al actualizar la actividad:", error.message);
    throw new Error("Error en el controlador al actualizar la actividad: " + error.message);
  }
}


  async deleteActividad(id, objetivoId, actividadId) {
    const proyecto = await this.service.deleteActividad(id, objetivoId, actividadId);
    return proyecto;
  }
}

module.exports = ProyectoSemController;
