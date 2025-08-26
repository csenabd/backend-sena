const express = require("express");
const { port: configPort, hostback } = require("./config/config");
const routerApi = require("./routes/index");
const connect = require("./libs/mongoose");
const { crearAdmin } = require("./seeders/seeder");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

//lo mismo
//const https = require('https');
//si se cambia la config con el certificado - también se debe cambiar la invación de la librería
const http = require('http');

const fileSystem = require("fs");

const PORT = process.env.PORT || process.env.APP_PORT || configPort || 3300;

const start = async () => {
  try {
    await connect();
    // Crear roles y admin sólo después de conexión exitosa
    await crearAdmin();

    const server = http.createServer(app).listen(PORT, () => {
      console.log(`APP corriendo por el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Fallo iniciando la app:', error.message);
    process.exit(1);
  }
};

start();
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
// El servidor se inicia desde start()
