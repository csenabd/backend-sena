const express = require("express");
const { port, hostback } = require("./config/config");
const routerApi = require("./routes/index");
const connect = require("./libs/mongoose");
const createRoles = require("./seeders/seeder");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

//lo mismo
//const https = require('https');
//si se cambia la config con el certificado - también se debe cambiar la invación de la librería
const http = require('http');

const fileSystem = require("fs");

connect();
createRoles;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));
app.use(cors());
app.use(helmet());
routerApi(app);

/*const fs = require('fs');
const path = require('path');


//primer llamado - para la verificación de certificados - para el cifrado de datos
//como no se cuenta de forma local, no se ejecuta una conexión exitosa a un protocolo https
//const sslFiles = {
 // cert: fs.readFileSync(path.join(__dirname, '../../../../apache/conf/ssl.crt/server.crt')),
  //key: fs.readFileSync(path.join(__dirname, '../../../../apache/conf/ssl.key/server.key')),
//};

//crear conexión segura - HTTPS
/*const server = https.createServer(sslFiles, app).listen(port, () => {
  console.log(`APP corriendo por el puerto ${port}`);
}); */

// Crear un servidor HTTP - CONEXIÓN SIN CIFRADO DE DATOS
const server = http.createServer(app).listen(port, () => {
  console.log(`APP corriendo por el puerto ${port}`);
});
