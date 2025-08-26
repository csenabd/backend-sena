const jwt = require("jsonwebtoken");
const { secretjwt } = require("../../config/config");
const loginSchema = require("../../database/models/login.model");
const rolSchema = require("../../database/models/roles.model");

const validateToken = async (req, res, next) => {
  const accessToken = req.headers["authorization"] || req.query.accesstoken;
  if (!accessToken) {
    console.log("Token no encontrado en encabezados o parámetros de consulta");
    return res.status(404).json({ message: "No hay token" });
  }

  // Log para depuración
  console.log("Token recibido:", accessToken);

  // Remover 'Bearer ' si el token tiene este prefijo
  const token = accessToken.startsWith("Bearer ") ? accessToken.slice(7, accessToken.length) : accessToken;

  // Validar que el token no esté vacío ni sea solo espacios
  if (!token || token.trim() === "") {
    console.log("Token vacío o solo espacios");
    return res.status(400).json({ message: "Token vacío o inválido" });
  }

  try {
    const userverify = jwt.verify(token, secretjwt);
    req.userId = userverify.id;
    const user = await loginSchema.findById(req.userId);
    if (!user) {
      console.log("Usuario no encontrado", user);
      return res.status(404).json({ message: "El usuario no se encontró" });
    }
    req.userRoles = await rolSchema.find({ _id: { $in: user.rol } });
    next();
  } catch (error) {
    console.log("La verificación del token falló:", error);
    // Mensaje más claro según el tipo de error
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token mal formado o inválido" });
    }
    return res.status(401).json({ message: "No tiene autorización!" });
  }
};


const rolesPriorities = {
  "admin": 3,
  "gestor": 2,
  "aprendiz": 1
};

const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.userRoles) {
      return res.status(500).json({ message: "Roles del usuario no encontrados" });
    }

    const userHighestRole = req.userRoles.reduce((highestRole, role) => {
      const rolePriority = rolesPriorities[role.name];
      return rolePriority > rolesPriorities[highestRole.name] ? role : highestRole;
    }, { name: 'aprendiz' });

    const requiredRolePriority = rolesPriorities[requiredRole];
    const userRolePriority = rolesPriorities[userHighestRole.name];

    if (userRolePriority >= requiredRolePriority) {
      next();
    } else {
      return res.status(403).json({ message: `Debe tener permiso de ${requiredRole}` });
    }
  };
};


module.exports = {
  validateToken,
  verifyRole,
};
