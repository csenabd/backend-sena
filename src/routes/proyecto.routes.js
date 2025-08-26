const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyecto.controller");
const proyectoSchema = require("../database/models/proyecto.model");
const gestorSchema = require('../database/models/gestor.model');
const multer = require("multer");
const fs = require("node:fs");
const path = require("path");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { hostback } = require("../config/config");
const {
  validateToken,
  verifyRole,
} = require("../function/jwt/proteccionrutas");

const controller = new proyectoController();
const publicDir = path.resolve(__dirname, "../../public");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "cloudsena2@gmail.com",
    pass: "cloud3406",
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "cloudsena2@gmail.com",
      to,
      subject,
      html: text,
    });
    console.log("Correo enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

const generateConfirmationCode = () => {
  return crypto.randomBytes(3).toString("hex");
};

const deleteFiles = async (filePaths) => {
  try {
    for (const filePath of filePaths) {
      const ext = path.extname(filePath);
      let folder;
      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        folder = "Img";
      } else if (ext === ".mp4") {
        folder = "Video";
      } else if (ext === ".pdf" || ext === ".docx") {
        folder = "Doc";
      }
      const fullPath = path.join(publicDir, folder, path.basename(filePath));
      await fs.promises.unlink(fullPath);
    }
    console.log("Archivos eliminados con éxito");
  } catch (error) {
    console.error("Error al eliminar archivos:", error);
  }
};

const storage = multer.diskStorage({
  destination: "./public",
  filename: (req, file, cb) => {
    const originalFilename = file.originalname;
    const extension = path.extname(originalFilename);
    const filename = `${Date.now()}${extension}`;
    cb(null, filename);
  },
});

const limits = {
  files: 5,
  fileSize: 150 * 1024 * 1024,
};

const upload = multer({ storage, limits });

router.get("/", async (req, res) => {
  try {
    const proyectos = await controller.index();
    res.json({ proyectos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  validateToken,
  verifyRole("aprendiz") ||
  verifyRole("gestor") ||
  verifyRole("admin"),
  upload.array("files", 5),
  async (req, res) => {
    const { projectName, autores, ficha, fecha, descripcion, objetivoGeneral, objetivosEspecificos } = req.body;
    const img = [];
    const doc = [];
    const video = [];

    req.files.forEach((file) => {
      const ext = path.extname(file.originalname);
      const filePath = path.join(
        publicDir,
        ext === ".jpg" || ext === ".jpeg" || ext === ".png"
          ? "/Img"
          : ext === ".mp4"
          ? "/Video"
          : "/Doc",
        file.filename
      );

      fs.renameSync(path.join(publicDir, file.filename), filePath);

      if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
        img.push(`${hostback}/Img/${file.filename}`);
      } else if (ext === ".mp4") {
        video.push(`${hostback}/Video/${file.filename}`);
      } else if (ext === ".pdf" || ext === ".docx") {
        doc.push(`${hostback}/Doc/${file.filename}`);
      }
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No se subieron archivos.");
    }

    const existingProject = await proyectoSchema.findOne({
      nombre: projectName,
    });
    if (existingProject) {
      await deleteFiles([...img, ...video, ...doc]);
      return res
        .status(400)
        .json({ message: "El nombre ya se encuentra registrado" });
    } else {
      const fecha1 = new Date(fecha);
      const formattedDate = `${fecha1.getDate()}/${
        fecha1.getMonth() + 1
      }/${fecha1.getFullYear()}`;

      const proyecto = new proyectoSchema({
        nombre: projectName,
        autores: autores,
        ficha: [ficha],
        fecha: formattedDate,
        descripcion: descripcion,
        documentacion: doc,
        imagenes: img,
        video: video,
        objetivoGeneral: objetivoGeneral,
        objetivosEspecificos: JSON.parse(objetivosEspecificos),
      });
      try {
        await controller.create(proyecto);
        img.length = 0;
        video.length = 0;
        doc.length = 0;
        res
          .status(201)
          .json({ proyecto, message: "Archivos subidos exitosamente." });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const proyecto = await controller.getById(id);
    res.json({ proyecto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(
  "/:id",
  validateToken,
  verifyRole("aprendiz") ||
  verifyRole("gestor") ||
  verifyRole("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { projectName, autores, ficha, fecha, descripcion, objetivoGeneral, objetivosEspecificos } = req.body;
    const values = {};
    const nombredup = await proyectoSchema.findOne({ nombre: projectName });
    if (nombredup && nombredup._id.toString() !== id) {
      return res
        .status(400)
        .json({ message: "El nombre ya se encuentra registrado" });
    }
    if (projectName) values.nombre = projectName;
    if (autores) values.autores = autores;
    if (ficha) values.ficha = [ficha];
    if (fecha) values.fecha = fecha;
    if (descripcion) values.descripcion = descripcion;
    if (objetivoGeneral) values.objetivoGeneral = objetivoGeneral;
    if (objetivosEspecificos) values.objetivosEspecificos = JSON.parse(objetivosEspecificos);
    try {
      const proyecto = await controller.update(id, values);
      res.status(200).json({ proyecto });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
);

router.put(
  "/:id/objetivo-especifico/:objetivoId",
  validateToken,
  verifyRole("aprendiz") || verifyRole("gestor") || verifyRole("admin"),
  async (req, res) => {
    const { id, objetivoId } = req.params;
    const { finalizado } = req.body;

    try {
      const proyecto = await controller.updateObjetivoEspecifico(id, objetivoId, finalizado);
      if (!proyecto) {
        return res.status(404).json({ message: "Proyecto u objetivo no encontrado" });
      }
      res.status(200).json({ proyecto });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el objetivo específico", error: error.message });
    }
  }
);

router.get(
  "/:id/progreso",
  async (req, res) => {
    const { id } = req.params;

    try {
      const progreso = await controller.getProgreso(id);
      if (progreso === null) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
      }
      res.status(200).json({ progreso });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el progreso del proyecto", error: error.message });
    }
  }
);

router.post(
  "/:id/objetivo/:objetivoId/actividad",
  validateToken,
  verifyRole("aprendiz") || verifyRole("gestor") || verifyRole("admin"),
  async (req, res) => {
    const { id, objetivoId } = req.params;
    const { descripcion, finalizado } = req.body;

    try {
      const proyecto = await controller.addActividad(id, objetivoId, { descripcion, finalizado });
      res.status(201).json({ proyecto });
    } catch (error) {
      res.status(500).json({ message: "Error al añadir la actividad", error: error.message });
    }
  }
);

router.put(
  "/:id/objetivo/:objetivoId/actividad/:actividadId",
  validateToken,
  verifyRole("aprendiz") || verifyRole("gestor") || verifyRole("admin"),
  upload.array("files", 5),  // Manejo de múltiples archivos
  async (req, res) => {
    const { id, objetivoId, actividadId } = req.params;
    const { finalizado } = req.body;


    try {
      const proyecto = await controller.updateActividad(
        id, 
        objetivoId, 
        actividadId, 
        finalizado, 
        req.files // Pasamos los archivos subidos al controlador
      );

      if (!proyecto) {
        return res.status(404).json({ message: "Proyecto u objetivo no encontrado" });
      }

      res.status(200).json({ proyecto });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la actividad", error: error.message });
    }
  }
);

router.delete(
  "/:id/objetivo/:objetivoId/actividad/:actividadId",
  validateToken,
  verifyRole("aprendiz") || verifyRole("gestor") || verifyRole("admin"),
  async (req, res) => {
    const { id, objetivoId, actividadId } = req.params;

    try {
      const proyecto = await controller.deleteActividad(id, objetivoId, actividadId);
      res.status(200).json({ message: "Actividad eliminada exitosamente", proyecto });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la actividad", error: error.message });
    }
  }
);

router.post(
  "/:id/send-code",
  validateToken,
  verifyRole("gestor") ||
  verifyRole("admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const proyecto = await controller.getById(id);
      console.log(proyecto);
      if (!proyecto) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
      }

      const confirmationCode = generateConfirmationCode();
      await proyectoSchema.updateOne({ _id: id }, { confirmationCode });

      const objectG= proyecto.ficha
      const  gestor = await gestorSchema.findOne({id: objectG.gestor});
      const email = gestor.correo;
      const subject = "Confirmación de eliminación de proyecto";
      const text = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    line-height: 1.6;
                }
                .container {
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 5px;
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #777;
                }
                .confirmation-code {
                    font-weight: bold;
                    color: #d9534f;
                }
                .logo {
                    max-width: 100px;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Eliminación del Proyecto</h1>
                </div>
                <div class="content">
                    <p>Para proceder con la eliminación del proyecto, por favor, utiliza el siguiente código de confirmación:</p>
                    <p class="confirmation-code">${confirmationCode}</p>
                </div>
                <div class="footer">
                    <p>Saludos cordiales</p>
                </div>
            </div>
        </body>
        </html>
        `;
      await sendEmail(email, subject, text);
      return res
        .status(200)
        .json({ message: "Código de confirmación enviado con éxito a "+email });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al enviar el código de confirmación" + error });
    }
  }
);

router.delete(
  "/:id",
  validateToken,
  verifyRole("aprendiz") ||
  verifyRole("gestor") ||
  verifyRole("admin"),
  async (req, res) => {
    const { id } = req.params;
    const confirmationCode = req.query.confirmationCode;

    try {
      const proyecto = await controller.getById(id);
      if (!proyecto) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
      }

      if (confirmationCode === proyecto.confirmationCode) {
        await controller.remove(id);
        return res
          .status(200)
          .json({ message: "Proyecto eliminado exitosamente" });
      } else {
        return res
          .status(400)
          .json({ message: "Código de confirmación incorrecto" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el proyecto" });
    }
  }
);

module.exports = router;