const router = require("express").Router();
const gestorController = require("../controllers/gestor.controller");
const gestorSchema = require("../database/models/gestor.model");
const loginSchema = require("../database/models/login.model");
const rolSchema = require("../database/models/roles.model");
const {
  validateToken,
  verifyRole,
} = require("../function/jwt/proteccionrutas");

const controller = new gestorController();

router.get("/", async (req, res) => {
    const gestors = await controller.index();
    res.json({ gestors });
});

router.post(
  "/",
  validateToken,
  verifyRole("admin"),
  async (req, res) => {
    const { nombre, documento, celular, correo} = req.body;
    const role = await rolSchema.findOne({ name: "gestor" });
    const rolid = [role._id];
    const user= new loginSchema({
      email: correo,
      password: documento,
      nombre: nombre,
      documento: documento,
      rol: rolid,
    })
    const gestor = new gestorSchema({
      nombre: nombre,
      documento: documento,
      celular: celular,
      correo: correo,
    });
    try {
      await controller.create(gestor);
      loginSchema.create(user);
      res.status(201).json({ gestor, user });
    } catch (error) {
      res.status(500).json({ error: "Error al guardar el gestor." });
    }
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const gestor = await controller.getById(id);
    res.json({ gestor });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el gestor." });
  }
});

router.put(
  "/:id",
  validateToken,
  verifyRole("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { nombre, documento, celular, correo } = req.body;
    const values = {};
    if (nombre) values.nombre = nombre;
    if (documento) values.documento = documento;
    if (celular) values.celular = celular;
    if (correo) values.correo = correo;
    try {
      const gestor = await controller.update(id, values);
      const user= await loginSchema.findOne({documento: gestor.documento})
      const newuser= await loginSchema.findByIdAndUpdate(user.id, values);
      res.status(200).json({ gestor });
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
      const gestor = await controller.remove(id);
      const user= await loginSchema.findOne({documento: gestor.documento})
      const newuser= await loginSchema.findByIdAndDelete(user.id);
      res.status(200).json({ gestor });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

module.exports = router;
