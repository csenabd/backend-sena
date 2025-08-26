const router = require("express").Router();
const fichaController = require("../controllers/ficha.controller");
const fichaSchema = require("../database/models/ficha.model");
const {
  validateToken,
  verifyRole,
} = require("../function/jwt/proteccionrutas");

const controller = new fichaController();

router.get("/", async (req, res) => {
  try {
    const fichas = await controller.index();
    res.json({ fichas });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las fichas" });
  }
});

router.post(
  "/",
  validateToken,
  verifyRole("admin"),
  async (req, res) => {
    const { nombre, codigo, fecha_fin, fecha_inicio, tipo, gestor } = req.body;
    const codigodup = await fichaSchema.findOne({ codigo });
    if (codigodup) {
      return res
        .status(400)
        .json({ message: "El código ya se encuentra registrado" });
    }
    if (!fecha_fin) {
      return res
        .status(404)
        .json({ message: "La fecha de fin debe ser obligatoria" });
    }
    if (!fecha_inicio) {
      return res
        .status(404)
        .json({ message: "La fecha de inicio debe ser obligatoria" });
    }
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);

    const fechaInicioFormatoString = fechaInicio.toISOString().substring(0, 10);
    const fechaFinFormatoString = fechaFin.toISOString().substring(0, 10);

    const ficha = new fichaSchema({
      nombre: nombre,
      codigo: codigo,
      fecha_inicio: fechaInicioFormatoString,
      fecha_fin: fechaFinFormatoString,
      tipo: tipo,
      gestor: [gestor],
    });

    try {
      await controller.create(ficha);
      res.status(201).json({ ficha });
    } catch (error) {
      res.status(500).json({ error: "Error al guardar la ficha." });
    }
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ficha = await controller.getById(id);
    res.json({ ficha });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la ficha" });
  }
});

router.put(
  "/:id",
  validateToken,
  verifyRole("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, fecha_fin, fecha_inicio, tipo } = req.body;
    const values = {};
    if (nombre) values.nombre = nombre;
    if (codigo) values.codigo = codigo;
    if (fecha_fin) values.fecha_fin = fecha_fin;
    if (fecha_inicio) values.fecha_inicio = fecha_inicio;
    if (tipo) values.tipo = tipo;
    try {
      const ficha = await controller.update(id, values);
      res.status(200).json({ ficha });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

router.delete(
  "/:id",
  validateToken,
  verifyRole("admin"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const ficha = await controller.remove(id);
      res.status(200).json({ ficha });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

module.exports = router;
